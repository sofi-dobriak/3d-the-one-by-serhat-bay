import { detect  } from "detect-browser";
import dispatchTrigger from "./helpers/triggers";

class History {
  constructor(data) {
    this.history = [];
    this.s3dHistory = [];
    this.updateFsm = data.updateFsm;
    this.update = this.update.bind(this);
    this.next = this.next.bind(this);
    this.parseSearchUrl = this.parseSearchUrl.bind(this);
    this.replaceUrl = this.replaceUrl.bind(this);
    this.stepBack = this.stepBack.bind(this);
    this.browser = detect();
    this.init();
  }

  init() {
    window.onpopstate = e => {
      this.stepBack(e.state);
      return true;
    };
  }

  stepBack(data) {
    const s3dBackState = this.s3dHistory.pop();
    if (s3dBackState) {
      this.updateFsm(s3dBackState, 'dontUpdateLocalHistory');
    }
  }

  next(name, dontUpdateLocalHistory) {
    window.history.pushState(
      name, '3dModule', this.createUrl(name),
      );
      window.history.prevState = this.history;
      this.prevState = this.history;
      if (!dontUpdateLocalHistory) {
        this.s3dHistory.push(this.history);
      }
      this.history = name;      
      dispatchTrigger('historyUpdated', this.history);
  }

  update(search) {

    const currentSearchParams = Object.entries(this.parseSearchUrl(window.location))
    .filter(([key, value]) => !/flyby|side/.test(key)).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    const searchConfig = this.parseSearchUrl(window.location);
    const newSearch = {
      ...currentSearchParams,
      ...searchConfig,
      ...search,
    };

    window.history.replaceState(
      newSearch, '3dModule', this.createUrl(newSearch),
    );
    this.history = newSearch;
    dispatchTrigger('historyUpdated');
  }

  replaceUrl(name) {
    window.history.replaceState(
      name, '3dModule', this.createUrl(name),
    );
  }

  createUrl(data) {
    const entries = Object.entries(data);
    const href = entries.reduce((acc, [key, value]) => `${acc}&${key}=${value}`, '');
    // return `?${encodeURIComponent(href)}`;
    return `?${href}`;
  }

  parseSearchUrl(url) {
    const { searchParams } = new URL(decodeURIComponent(url));
    if(!Object.fromEntries) Object.fromEntries = fromEntries;
    const parseSearchParam = Object.fromEntries(searchParams.entries());
    return parseSearchParam;
  }

  deleteSearchParam(key) {
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.delete(key);
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.replaceState(null, '', newRelativePathQuery);
    } else {
      console.warn('URLSearchParams in window is not found');
    }
  }

  pushSingleSearchParam(key,value) {
    if (!value) return;
    if ('URLSearchParams' in window) { 
      var searchParams = new URLSearchParams(window.location.search)
      searchParams.set(key, value);
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.replaceState(null, '', newRelativePathQuery);
    } else {
      console.warn('URLSearchParams in window is not found');
    }
  }

  pushParams(params) {
    console.log('pushParams', params);
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search);
      for (let key in params) {
        searchParams.set(key, params[key]);
      }
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.replaceState({
        ...parseSearchUrl(window.location),
        ...params,
      }, '', newRelativePathQuery);
    } else {
      console.warn('URLSearchParams in window is not found');
    }
  }

  removeParamsByRegExp(regExp) {
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search);

      Array.from(searchParams.keys()).forEach(key => {
        if (regExp.test(key)) {
          searchParams.delete(key);
        }
      });

      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.replaceState(null, '', newRelativePathQuery);
    } else {
      console.warn('URLSearchParams in window is not found');
    }
  }

  getParam(key) {
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search);      
      return searchParams.get(key);
    } else {
      console.warn('URLSearchParams in window is not found');
      return null;
    }
  }
}

export default History;

export function  parseSearchUrl(url) {
  const { searchParams } = new URL(decodeURIComponent(url));
  if(!Object.fromEntries) Object.fromEntries = fromEntries;
  const parseSearchParam = Object.fromEntries(searchParams.entries());
  return parseSearchParam;
}

function fromEntries(entries){
  var res = {};
  for(var i = 0; i < entries.length; i++) res[entries[i][0]] = entries[i][1];
  return res;
}