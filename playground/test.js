export class Debugger {
  static startTime

  static log() {
    console.log(arguments)
  }

  static timeStart() {
    Debugger.startTime = Debugger.now()
  }

  static now() {
    return ( typeof performance === 'undefined' ? Date : performance ).now()
  }
}
