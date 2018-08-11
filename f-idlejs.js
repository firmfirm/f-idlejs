/**
shawnmclean/Idle.js wrapper element.

Example:

    <f-idlejs timeout="5000"></f-idlejs>

@element f-idlejs
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';
import '@mkazlauskas/idle.js/build/idle.min.js';

import './finterface-idle-tracker.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
(function(document) {
  Polymer({
    is: 'f-idlejs',
    behaviors: [FInterface.IdleTracker],
    observers: ['_timeoutChanged(timeout)'],

    attached() {
      this._pauseListener = () => this._timeoutChanged();
      this._resumeListener = () => this._timeoutChanged(this.timeout);
      document.addEventListener('f-idlejs-pause', this._pauseListener);
      document.addEventListener('f-idlejs-resume', this._resumeListener);
    },

    detached() {
      document.removeEventListener('f-idlejs-pause', this._pauseListener);
      document.removeEventListener('f-idlejs-resume', this._resumeListener);
    },

    _timeoutChanged(newValue) {
      if (this._idle) this._idle.stop();
      if (!newValue) return;
      this._idle = new Idle({
                onHidden: this._hidden.bind(this),
                onVisible: this._visible.bind(this),
                onAway: this._away.bind(this),
                onAwayBack: this._back.bind(this),
                awayTimeout: newValue
            });
      this._idle.start();
    },

    _hidden() { this.fire('hidden'); },
    _visible() { this.fire('visible'); },
    _away() { this.fire('away'); },
    _back() { this.fire('back'); }
  });
})(document);
