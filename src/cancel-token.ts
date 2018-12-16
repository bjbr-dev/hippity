const CANCEL = Symbol()

export interface CancellationToken {
  readonly cancelled: boolean
  onCancel(callback: (error: Error) => void): void
  throwIfCancelled(): void
}

class CancellationTokenImpl implements CancellationToken {
  private callbacks: { (error: Error): void }[] = []
  private cancelReason: string | null = null

  throwIfCancelled() {
    if (this.cancelReason !== null) {
      throw new Error(this.cancelReason)
    }
  }

  [CANCEL](reason?: string) {
    if (reason) {
      this.cancelReason = 'Promise was cancelled: ' + reason
    } else {
      this.cancelReason = 'Promise was cancelled'
    }

    for (let callback of this.callbacks) {
      callback(new Error(this.cancelReason))
    }
  }

  onCancel(callback: (error: Error) => void) {
    this.callbacks.push(callback)
  }

  get cancelled(): boolean {
    return this.cancelReason !== null
  }
}

export class CancellationTokenSource {
  public token: CancellationTokenImpl

  constructor() {
    this.token = new CancellationTokenImpl()
  }

  cancel(reason?: string) {
    this.token[CANCEL](reason)
  }

  get cancelled(): boolean {
    return this.token.cancelled
  }
}
