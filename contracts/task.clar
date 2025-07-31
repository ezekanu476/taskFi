;; TaskFi Task Contract
;; Decentralized task management: create, assign, complete, and cancel tasks

(define-data-var admin principal tx-sender)

(define-map tasks
  uint
  {
    creator: principal,
    assignee: (optional principal),
    title: (string-ascii 80),
    description: (string-ascii 256),
    reward: uint,
    status: (string-ascii 16), ;; "pending", "assigned", "completed", "cancelled"
    created-at: uint
  }
)

(define-data-var task-counter uint u0)

;; Constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-TASK-NOT-FOUND u101)
(define-constant ERR-INVALID-STATUS u102)
(define-constant ERR-NOT-CREATOR u103)
(define-constant ERR-NOT-ASSIGNEE u104)
(define-constant ERR-TASK-ALREADY-ASSIGNED u105)
(define-constant ERR-EMPTY-TITLE u106)
(define-constant ERR-EMPTY-DESCRIPTION u107)

;; Helpers

(define-private (is-admin (sender principal))
  (is-eq sender (var-get admin))
)

(define-private (get-task (task-id uint))
  (match (map-get? tasks task-id)
    task task
    (err ERR-TASK-NOT-FOUND)
  )
)

(define-private (non-empty-string? (input (string-ascii 256)))
  (> (len input) u0)
)

;; Public Functions

(define-public (create-task
  (title (string-ascii 80))
  (description (string-ascii 256))
  (reward uint)
)
  (begin
    (asserts! (non-empty-string? title) (err ERR-EMPTY-TITLE))
    (asserts! (non-empty-string? description) (err ERR-EMPTY-DESCRIPTION))
    (let ((task-id (var-get task-counter)))
      (begin
        (map-set tasks task-id {
          creator: tx-sender,
          assignee: none,
          title: title,
          description: description,
          reward: reward,
          status: "pending",
          created-at: block-height
        })
        (var-set task-counter (+ task-id u1))
        (ok task-id)
      )
    )
  )
)

(define-public (assign-task (task-id uint) (assignee principal))
  (let ((task (unwrap! (get-task task-id) (err ERR-TASK-NOT-FOUND))))
    (begin
      (asserts! (is-eq (get creator task) tx-sender) (err ERR-NOT-CREATOR))
      (asserts! (is-eq (get status task) "pending") (err ERR-INVALID-STATUS))
      (map-set tasks task-id (merge task { assignee: (some assignee), status: "assigned" }))
      (ok true)
    )
  )
)

(define-public (complete-task (task-id uint))
  (let ((task (unwrap! (get-task task-id) (err ERR-TASK-NOT-FOUND))))
    (begin
      (asserts! (is-some (get assignee task)) (err ERR-NOT-ASSIGNEE))
      (asserts! (is-eq (unwrap-panic (get assignee task)) tx-sender) (err ERR-NOT-ASSIGNEE))
      (asserts! (is-eq (get status task) "assigned") (err ERR-INVALID-STATUS))
      (map-set tasks task-id (merge task { status: "completed" }))
      (ok true)
    )
  )
)

(define-public (cancel-task (task-id uint))
  (let ((task (unwrap! (get-task task-id) (err ERR-TASK-NOT-FOUND))))
    (begin
      (asserts! (is-eq (get creator task) tx-sender) (err ERR-NOT-CREATOR))
      (asserts! (not (is-eq (get status task) "completed")) (err ERR-INVALID-STATUS))
      (map-set tasks task-id (merge task { status: "cancelled" }))
      (ok true)
    )
  )
)

(define-read-only (get-task-details (task-id uint))
  (map-get? tasks task-id)
)

(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
