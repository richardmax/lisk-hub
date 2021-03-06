import { expect } from 'chai';
import { spy, stub } from 'sinon';
import ipcLocale from './ipcLocale';

describe('ipcLocale', () => {
  let localStorageStub;
  const ipc = {
    on: spy(),
    send: spy(),
  };

  const i18n = {
    changeLanguage: spy(),
    on: spy(),
  };

  describe('init', () => {
    beforeEach(() => {
      delete window.ipc;
      i18n.language = '';

      localStorageStub = stub(localStorage, 'getItem');
    });

    afterEach(() => {
      localStorageStub.restore();
    });

    it('calling init when ipc is not on window does not call ipc', () => {
      ipcLocale.init(i18n);
      expect(ipc.on).to.not.have.been.calledWith();
      expect(ipc.send).to.not.have.been.calledWith();
    });

    it('calling init when ipc is not on window saves locale in browser when there is no locale in i18n', () => {
      localStorageStub.withArgs('lang').returns('en');

      ipcLocale.init(i18n);
      expect(ipc.on).to.not.have.been.calledWith();
      expect(ipc.send).to.not.have.been.calledWith();

      expect(i18n.changeLanguage).to.have.been.calledWith('en');
    });

    it('calling init when ipc is not on window saves locale in browser when there is no locale in localStorage', () => {
      localStorageStub.withArgs('lang').returns('');
      i18n.language = 'de';

      ipcLocale.init(i18n);
      expect(i18n.changeLanguage).to.have.been.calledWith('de');
    });

    it('calling init when ipc is not on window saves locale in browser when there is no locale saved at all', () => {
      localStorageStub.withArgs('lang').returns('');

      ipcLocale.init(i18n);
      expect(i18n.changeLanguage).to.have.been.calledWith('en');
    });

    it('should be a function', () => {
      expect(typeof ipcLocale.init).to.be.equal('function');
    });

    it('calling init when ipc is available on window should bind listeners', () => {
      window.ipc = ipc;
      ipcLocale.init(i18n);
      expect(ipc.on).to.have.been.calledWith();
      expect(i18n.on).to.have.been.calledWith();
    });

    it('calling init when ipc is available and there is no locale in i18n will make a request for locale ', () => {
      window.ipc = ipc;

      ipcLocale.init(i18n);
      expect(ipc.send).to.have.been.calledWith('request-locale');
    });
  });
});
