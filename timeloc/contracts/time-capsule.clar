;; Digital Time Capsule
;; A smart contract that allows users to store encrypted messages that can only be accessed after a specified time
;; Contract name: digital-time-capsule

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-already-exists (err u101))
(define-constant err-not-found (err u102))
(define-constant err-too-early (err u103))

;; Data variable to store capsules
(define-map capsules
    { capsule-id: uint }
    {
        owner: principal,
        message: (string-utf8 500),
        unlock-height: uint,
        is-revealed: bool
    }
)

;; Counter for capsule IDs
(define-data-var next-capsule-id uint u1)

;; Internal function to store capsule
(define-private (store-capsule (capsule-id uint) (message (string-utf8 500)) (unlock-height uint))
    (begin
        (map-insert capsules
            { capsule-id: capsule-id }
            {
                owner: tx-sender,
                message: message,
                unlock-height: unlock-height,
                is-revealed: false
            }
        )
        true
    )
)

;; Create a new time capsule
(define-public (create-capsule (message (string-utf8 500)) (blocks-locked uint))
    (let
        (
            (capsule-id (var-get next-capsule-id))
            (unlock-height (+ block-height blocks-locked))
        )
        (asserts! (> blocks-locked u0) (err u104))
        (asserts! (store-capsule capsule-id message unlock-height) (err u105))
        (var-set next-capsule-id (+ capsule-id u1))
        (ok capsule-id)
    )
)

;; Reveal a capsule if the unlock height has been reached
(define-public (reveal-capsule (capsule-id uint))
    (let
        (
            (capsule (unwrap! (map-get? capsules { capsule-id: capsule-id }) (err u102)))
            (current-height block-height)
        )
        (asserts! (>= current-height (get unlock-height capsule)) err-too-early)
        (asserts! (is-eq (get owner capsule) tx-sender) (err u105))
        (ok (get message capsule))
    )
)

;; Get capsule details (only owner)
(define-read-only (get-capsule-details (capsule-id uint))
    (let
        (
            (capsule (unwrap! (map-get? capsules { capsule-id: capsule-id }) (err u102)))
        )
        (asserts! (is-eq (get owner capsule) tx-sender) (err u105))
        (ok {
            unlock-height: (get unlock-height capsule),
            is-revealed: (get is-revealed capsule)
        })
    )
)

;; Get total number of capsules
(define-read-only (get-total-capsules)
    (ok (- (var-get next-capsule-id) u1))
)