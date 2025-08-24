
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

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
});
