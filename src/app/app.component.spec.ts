
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationEnd } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
  const menuLinks = app.querySelectorAll('a[mat-list-item]');
  expect(menuLinks.length).toEqual(4);
  expect(menuLinks[0].querySelector('span').textContent).toContain('Produtos');
  expect(menuLinks[1].querySelector('span').textContent).toContain('Novo Produto');
  expect(menuLinks[2].querySelector('span').textContent).toContain('Simulação');
  expect(menuLinks[3].querySelector('span').textContent).toContain('Resultado');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuLinks = app.querySelectorAll('a[mat-list-item]');
    expect(menuLinks.length).toEqual(4);
    expect(menuLinks[0].getAttribute('href')).toContain('/produtos');
    expect(menuLinks[1].getAttribute('href')).toContain('/novo-produto');
    expect(menuLinks[2].getAttribute('href')).toContain('/simulacao');
    expect(menuLinks[3].getAttribute('href')).toContain('/resultado');
  });
  it('should navigate to root and close drawer on logo click', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const drawerMock = { close: jasmine.createSpy('close') };
    spyOn(app.router, 'navigate');
    app.onLogoClick(drawerMock);
    expect(app.router.navigate).toHaveBeenCalledWith(['']);
    expect(drawerMock.close).toHaveBeenCalled();
  });
  it('should navigate to root and not throw if drawer is undefined', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app.router, 'navigate');
    expect(() => app.onLogoClick(undefined)).not.toThrow();
    expect(app.router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should set activeUrl when router emits NavigationEnd', () => {
    const routerMock: any = { events: of(new NavigationEnd(1, '/foo', '/foo')), navigate: jasmine.createSpy('navigate') };
    const app = new AppComponent(routerMock as any);
    expect(app.activeUrl).toBe('/foo');
  });

  it('isActive returns true when urls match and false otherwise', () => {
    const routerMock: any = { events: of(new NavigationEnd(1, '/bar', '/bar')), navigate: jasmine.createSpy('navigate') };
    const app = new AppComponent(routerMock as any);
    const page = { title: 'X', url: '/bar', icon: 'i' };
    expect(app.isActive(page)).toBeTrue();
    const other = { title: 'Y', url: '/other', icon: 'i' };
    expect(app.isActive(other)).toBeFalse();
  });

  it('toggle and close call drawer methods when drawer is present', () => {
    const routerMock: any = { events: of(new NavigationEnd(1, '/', '/')), navigate: jasmine.createSpy('navigate') };
    const app = new AppComponent(routerMock as any);
    app.drawer = { toggle: jasmine.createSpy('toggle'), close: jasmine.createSpy('close') } as any;
    app.toggle();
    expect((app.drawer as any).toggle).toHaveBeenCalled();
    app.close();
    expect((app.drawer as any).close).toHaveBeenCalled();
  });
});
