export interface Clock {
  getTime(): Date
}

export class TestingClock implements Clock {
  time: Date = new Date()

  setTime(time: Date) {
    this.time = time
  }

  getTime(): Date {
    return this.time
  }
}
