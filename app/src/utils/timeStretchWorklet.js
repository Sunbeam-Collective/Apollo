// from: https://github.com/WebAudio/web-audio-api/issues/2487
//
// -> Web Audio API preserves pitch when changing playbackRate
//    on an HTMLMediaElement but not on AudioBufferSourceNodes
//    created with the same API... and the feature has been
//    on hold for... almost 2 years now. But top comment on this
//    thread built their own worklet extension which SHOULD let
//    ASBN's preseve pitch when changing playbackRate

/**
 * Timestretch Worklet
 * ES6 class abstraction for a phaseVocoder worklet via the AudioWorkletNode. This
 * worklet is capable of shifting pitch without affecting the playback speed. Using
 * this in combination with adjusting playback speed, it can be used for a
 * timestretch effect in which audio playback speed changes without affecting pitch. An
 * example implementation of both can be found in www.js
 * @public
 * @class
 */
class TimestretchWorklet {

  /**
   * Create new iteration of the TimestretchWorklet class along with a new AudioWorkletNode
   * which is available on the class's .workletNode property.
   * @param {AudioContext} ctx - Web audio context to be used
   * @param {AudioBufferSourceNode} bufferSource - (optional) bufferSource to automatically connect the new AudioWorkletNode to
   * @param {string} modulePath - Path to the module (for use when custom paths to local assets are needed, ie: vue.js)
   * @param {opts} opts - (optional) Options to pass directly to the AudioWorkletNode
   * @param {float} pitch - (optional) Initial pitch shift for the AudioWorkletNode
   * @returns {TimestretchWorklet}
   */
  static async createWorklet({
    ctx,
    bufferSource,
    modulePath,
    opts={},
    pitch,
  }) {
    const worklet = new TimestretchWorklet(ctx)

    try {
      await ctx.audioWorklet.addModule(modulePath || 'phaseVocoder.js')
    } catch (err) {
      throw new Error(`Error adding module: ${err}`)
    }

    try {
      worklet.workletNode = new AudioWorkletNode(
        ctx,
        'phase-vocoder-processor',
        opts
      )

      if (pitch) {
        worklet.updatePitch(pitch)
      }

      if (bufferSource) {
        worklet.workletNode.parameters.get('playbackRate').value = bufferSource.playbackRate.value
        bufferSource.connect(worklet.workletNode);
        worklet.bufferSource = bufferSource;
      }

      // update playbackRate via message to ensure they stay in sync
      worklet.workletNode.port.onmessage = (e) => {
        const { data } = e
        if (data.type === 'updatePlaybackRate') {
          worklet.bufferSource.playbackRate.value = data.rate
        }
      }
    } catch (err) {
      throw new Error(`Error creating worklet node: ${err}`)
    }

    return worklet
  }

  /**
   * Meant for interior use only via the static method createWorklet()
   * @param {AudioContext} ctx - Web audio context to be used
   */
  constructor(ctx) {
    this.bufferSource = null;
    this.ctx = ctx;
    this.pitch = 1.0;
    this.playbackRate = 1.0;
    this.workletNode = null;
  }


  /**
   * Connects an audio bufferSource (AudioBufferSourceNode) to the existing AudioWorkletNode
   * @param {AudioBufferSourceNode} bufferSource - bufferSource connect the AudioWorkletNode
   */
  connectBufferSource(bufferSource) {
    if (!this.workletNode) {
      throw new Error('No worklet created. Call createWorklet() first')
    }

    this.workletNode.parameters.get('playbackRate').value = bufferSource.playbackRate.value
    bufferSource.connect(this.workletNode)
    this.bufferSource = bufferSource;
  }

  /**
   * Updates the pitch of the worklet via an {AudioParam} of the AudioWorkletNode's processor
   * @param {float} pitch - Value of the pitch to set (0.1 to 2.0)
   */
  updatePitch(pitch) {
    this.workletNode.parameters.get('pitchFactor').value = parseFloat(pitch)
  }

  /**
   * Updates the playback rate of the AudioWorkletNode parameter. The processor
   * keep adjust the pitch to keep it the same despite the speed change.
   * @param {float} rate - Value of the rate to set (0.1 to 2.0)
   */
  updateSpeed(rate) {
    let parsedRate = parseFloat(rate)
    this.workletNode.parameters.get('playbackRate').value = parsedRate
  }

}

export {
  TimestretchWorklet
}
