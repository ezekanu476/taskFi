import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "ST1ADMIN0000000000000000000000000000000000",
  taskCounter: 0,
  tasks: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  createTask(caller: string, title: string, description: string, reward: number) {
    const taskId = this.taskCounter++
    this.tasks.set(taskId, {
      creator: caller,
      assignee: null,
      title,
      description,
      reward,
      status: "pending",
      createdAt: 1000
    })
    return { value: taskId }
  },

  assignTask(caller: string, taskId: number, assignee: string) {
    const task = this.tasks.get(taskId)
    if (!task) return { error: 101 }
    if (task.creator !== caller) return { error: 103 }
    if (task.status !== "pending") return { error: 102 }

    task.assignee = assignee
    task.status = "assigned"
    return { value: true }
  },

  completeTask(caller: string, taskId: number) {
    const task = this.tasks.get(taskId)
    if (!task) return { error: 101 }
    if (task.assignee !== caller) return { error: 104 }
    if (task.status !== "assigned") return { error: 102 }

    task.status = "completed"
    return { value: true }
  },

  cancelTask(caller: string, taskId: number) {
    const task = this.tasks.get(taskId)
    if (!task) return { error: 101 }
    if (task.creator !== caller) return { error: 103 }
    if (task.status === "completed") return { error: 102 }

    task.status = "cancelled"
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (caller !== this.admin) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe("Task Contract", () => {
  beforeEach(() => {
    mockContract.admin = "ST1ADMIN0000000000000000000000000000000000"
    mockContract.taskCounter = 0
    mockContract.tasks = new Map()
  })

  it("should create a task", () => {
    const result = mockContract.createTask("ST1USER1", "Task 1", "Complete this task", 100)
    expect(result.value).toBe(0)
    expect(mockContract.tasks.get(0).title).toBe("Task 1")
  })

  it("should assign a task", () => {
    mockContract.createTask("ST1USER1", "Task A", "Do work", 50)
    const result = mockContract.assignTask("ST1USER1", 0, "ST1USER2")
    expect(result).toEqual({ value: true })
    expect(mockContract.tasks.get(0).assignee).toBe("ST1USER2")
  })

  it("should not assign if not creator", () => {
    mockContract.createTask("ST1USER1", "Task A", "Do work", 50)
    const result = mockContract.assignTask("ST1USER3", 0, "ST1USER2")
    expect(result).toEqual({ error: 103 })
  })

  it("should complete a task", () => {
    mockContract.createTask("ST1USER1", "Task A", "Do work", 50)
    mockContract.assignTask("ST1USER1", 0, "ST1USER2")
    const result = mockContract.completeTask("ST1USER2", 0)
    expect(result).toEqual({ value: true })
    expect(mockContract.tasks.get(0).status).toBe("completed")
  })

  it("should not complete if not assignee", () => {
    mockContract.createTask("ST1USER1", "Task A", "Do work", 50)
    mockContract.assignTask("ST1USER1", 0, "ST1USER2")
    const result = mockContract.completeTask("ST1USER3", 0)
    expect(result).toEqual({ error: 104 })
  })

  it("should cancel a task", () => {
    mockContract.createTask("ST1USER1", "Task A", "Do work", 50)
    const result = mockContract.cancelTask("ST1USER1", 0)
    expect(result).toEqual({ value: true })
    expect(mockContract.tasks.get(0).status).toBe("cancelled")
  })

  it("should transfer admin rights", () => {
    const result = mockContract.transferAdmin("ST1ADMIN0000000000000000000000000000000000", "ST1NEWADMIN0000")
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("ST1NEWADMIN0000")
  })
})
