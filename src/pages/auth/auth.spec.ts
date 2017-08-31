import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils } from '../../test';
import { AuthPage } from './auth';

let fixture: ComponentFixture<AuthPage> = null;
let instance: any = null;

describe('Pages: AuthPage', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([AuthPage]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the AuthPage', async(() => {
    expect(instance).toBeTruthy();
  }));
});