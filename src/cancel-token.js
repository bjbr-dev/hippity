const CANCEL = Symbol()

class CancellationTokenImpl {
  constructor() {
    this.callbacks = []
    this.cancelReason = null
  }

  throwIfCancelled() {
    if (this.cancelReason !== null) {
      throw new Error(this.cancelReason)
    }
  }

  [CANCEL](reason) {
    if (reason) {
      this.cancelReason = 'Promise was cancelled: ' + reason
    } else {
      this.cancelReason = 'Promise was cancelled'
    }

    for (const callback of this.callbacks) {
      callback(new Error(this.cancelReason))
    }
  }

  onCancel(callback) {
    this.callbacks.push(callback)
  }

  get cancelled() {
    return this.cancelReason !== null
  }

  toJSON() {
    return { cancelled: this.cancelled }
  }
}

export class CancellationTokenSource {
  constructor() {
    this.token = new CancellationTokenImpl()
  }

  cancel(reason) {
    this.token[CANCEL](reason)
  }

  get cancelled() {
    return this.token.cancelled
  }
}
