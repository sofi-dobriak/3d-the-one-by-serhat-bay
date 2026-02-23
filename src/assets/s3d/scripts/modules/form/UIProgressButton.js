import classie from 'classie';

function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

function SVGEl(el) {
  this.el = el;
  // the path elements
  this.paths = [].slice.call(this.el.querySelectorAll('path'));
  // we will save both paths and its lengths in arrays
  this.pathsArr = new Array();
  this.lengthsArr = new Array();
  this._init();
}

SVGEl.prototype._init = function () {
  var self = this;
  this.paths.forEach(function (path, i) {
    self.pathsArr[i] = path;
    path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength();
  });
  // undraw stroke
  this.draw(0);
}

// val in [0,1] : 0 - no stroke is visible, 1 - stroke is visible
SVGEl.prototype.draw = function (val) {
  for (var i = 0, len = this.pathsArr.length; i < len; ++i) {
    this.pathsArr[i].style.strokeDashoffset = this.lengthsArr[i] * (1 - val);
  }
}

function UIProgressButton(el, options) {
  this.el = el;
  this.options = extend({}, this.options);
  extend(this.options, options);
  this._init();
  this.statusTime = this.options.statusTime || 1500;
}

UIProgressButton.prototype._init = function () {
  this.button = this.el.querySelector('button');
  this.progressEl = new SVGEl(this.el.querySelector('svg.form-progress-circle'));
  this.successEl = new SVGEl(this.el.querySelector('svg.checkmark'));
  this.errorEl = new SVGEl(this.el.querySelector('svg.cross'));
  this._initEvents();
  this._enable();
}

UIProgressButton.prototype._initEvents = function () {
  var self = this;
  self.startSubmit = function () {
    self._submit();
  };
  self.startLoad = function () {
    // self.setProgress(1);
    console.log('startLoad');
  };
  self.stop = function (status, cb = () => {}) {
    self.progressEl.draw(0);
    if (typeof status === 'number') {
      var statusClass = status >= 0 ? 'success' : 'error',
        statusEl = status >= 0 ? self.successEl : self.errorEl;

      // draw stroke of success (checkmark) or error (cross).
      statusEl.draw(1);
      // add respective class to the element
      classie.addClass(self.el, statusClass);
      // after options.statusTime remove status and undraw the respective stroke. Also enable the button.
      setTimeout(() => {
        cb(status);
      }, self.options.statusTime / 2);
      setTimeout(function () {
        classie.remove(self.el, statusClass);
        statusEl.draw(0);
        self._enable();
      }, self.options.statusTime);
    }
    else {
      self._enable();
    }
    classie.removeClass(self.el, 'loading');
  }
}

UIProgressButton.prototype._submit = function () {
  classie.addClass(this.el, 'loading');
}

// runs after the progress reaches 100%
UIProgressButton.prototype.stop = function (status) {
  var self = this,
    endLoading = function () {
      self.progressEl.draw(0);

      if (typeof status === 'number') {
        var statusClass = status >= 0 ? 'success' : 'error',
          statusEl = status >= 0 ? self.successEl : self.errorEl;
        statusEl.draw(1);
        // add respective class to the element
        classie.addClass(self.el, statusClass);
        setTimeout(function () {
          classie.remove(self.el, statusClass);
          statusEl.draw(0);
          self._enable();
        }, self.options.statusTime);
      }
      else {
        self._enable();
      }
      classie.removeClass(self.el, 'loading');
    };
  setTimeout(endLoading, 300);
}

UIProgressButton.prototype.setProgress = function (val) {
  this.progressEl.draw(val);
}
UIProgressButton.prototype._enable = function () {
  this.button.removeAttribute('disabled');
}

export default UIProgressButton