import {TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule, ObMasterLayoutService} from '@oblique/oblique';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {BehaviorSubject, of} from 'rxjs';
import {AppComponent} from './app.component';
import {OauthService} from './auth/oauth.service';
import {AuthFunction, AuthService} from "./auth/auth.service";

describe('AppComponent', () => {
	let app: AppComponent;
	let fixture;

	describe('Authenticated and authorized', () => {
		const oauthServiceMock = {
			name$: of('name'),
			isAuthenticated$: of(true),
			claims$: of({}),
			hasUserRole: () => true,
			logout: jest.fn(),
			initialize: jest.fn(),
			loadClaims: jest.fn()
		};
		const authServiceMock = {
			hasAuthorizationFor$: jest.fn().mockReturnValue(new BehaviorSubject(true).asObservable()),
			authorizedFunctions$:
				{
					pipe: () => ({
						subscribe: (fn) => {
							fn([
								AuthFunction.MAIN,
								AuthFunction.CERTIFICATE_REVOCATION,
								AuthFunction.BULK_OPERATIONS
							])
						}
					})
				}
		}
		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					imports: [
						RouterTestingModule.withRoutes([{path: 'test', component: AppComponent}]),
						ObliqueTestingModule
					],
					declarations: [AppComponent],
					schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
					providers: [
						{provide: OidcSecurityService, useValue: {isAuthenticated$: of(false)}},
						{provide: OauthService, useValue: oauthServiceMock},
						{provide: AuthService, useValue: authServiceMock},
						{provide: ObMasterLayoutService, useValue: {layout: {hasMainNavigation: undefined}}}
					]
				}).compileComponents();
				fixture = TestBed.createComponent(AppComponent);
				app = fixture.componentInstance;
			})
		);

		it('should create the app', () => {
			expect(app).toBeTruthy();
		});

		describe('name$', () => {
			it('should be defined', () => {
				expect(app.name$).toBeDefined();
			});

			it('should output a name', done => {
				app.name$.subscribe(tooltip => {
					expect(tooltip).toBe('name');
					done();
				});
			});
		});

		describe('isAuthenticated$', () => {
			it('should be defined', () => {
				expect(app.isAuthenticated$).toBeDefined();
			});

			it('should output a boolean', done => {
				app.isAuthenticated$.subscribe(isAuthenticated => {
					expect(isAuthenticated).toBe(true);
					done();
				});
			});

			it('should enable the main navigation', done => {
				const config = TestBed.inject(ObMasterLayoutService);
				app.isAuthenticated$.subscribe(() => {
					expect(config.layout.hasMainNavigation).toBe(true);
					done();
				});
			});
		});

		describe('ngAfterViewInit', () => {
			let oAuth: OauthService;
			beforeEach(() => {
				oAuth = TestBed.inject(OauthService);
			});
			it('should call initialize', () => {
				app.ngAfterViewInit();
				expect(oAuth.initialize).toHaveBeenCalled();
			});
			it('should call loadClaims', () => {
				app.ngAfterViewInit();
				expect(oAuth.loadClaims).toHaveBeenCalled();
			});
			it('should setup navigation', () => {
				app.ngAfterViewInit();
				expect(['dashboard', 'certificate-revoke', 'upload']).toEqual(app.navigation.map(n => n.url))
			});
		});

		describe('logout', () => {
			it('should call logout', () => {
				app.logout();
				const oAuth = TestBed.inject(OauthService);
				expect(oAuth.logout).toHaveBeenCalled();
			});
		});
	});

	describe('Authenticated and unauthorized', () => {
		const oauthServiceMock = {
			name$: of('name'),
			isAuthenticated$: of(true),
			claims$: of({}),
			hasUserRole: () => false,
			logout: jest.fn(),
			initialize: jest.fn(),
			loadClaims: jest.fn()
		};
		const authServiceMock = {
			hasAuthorizationFor$: jest.fn().mockReturnValue(new BehaviorSubject(false).asObservable())
		}

		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					imports: [
						RouterTestingModule.withRoutes([{path: 'test', component: AppComponent}]),
						ObliqueTestingModule
					],
					declarations: [AppComponent],
					schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
					providers: [
						{provide: OidcSecurityService, useValue: {isAuthenticated$: of(false)}},
						{provide: OauthService, useValue: oauthServiceMock},
						{provide: AuthService, useValue: authServiceMock},
						{provide: ObMasterLayoutService, useValue: {layout: {hasMainNavigation: undefined}}}
					]
				}).compileComponents();
				fixture = TestBed.createComponent(AppComponent);
				app = fixture.componentInstance;
			})
		);

		it('should create the app', () => {
			expect(app).toBeTruthy();
		});

		describe('isAuthenticated$', () => {
			it('should be defined', () => {
				expect(app.isAuthenticated$).toBeDefined();
			});

			it('should output a boolean', done => {
				app.isAuthenticated$.subscribe(isAuthenticated => {
					expect(isAuthenticated).toBe(true);
					done();
				});
			});

			it('should disable the main navigation', done => {
				const config = TestBed.inject(ObMasterLayoutService);
				app.isAuthenticated$.subscribe(() => {
					expect(config.layout.hasMainNavigation).toBe(false);
					done();
				});
			});
		});
	});

	describe('Unauthenticated', () => {
		const oauthServiceMock = {
			name$: of('name'),
			isAuthenticated$: of(false),
			initialize: jest.fn(),
			loadClaims: jest.fn()
		};
		const authServiceMock = {
			hasAuthorizationFor$: jest.fn().mockReturnValue(of())
		}
		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					imports: [
						RouterTestingModule.withRoutes([{path: 'test', component: AppComponent}]),
						ObliqueTestingModule
					],
					declarations: [AppComponent],
					schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
					providers: [
						{provide: OidcSecurityService, useValue: {isAuthenticated$: of(false)}},
						{provide: OauthService, useValue: oauthServiceMock},
						{provide: AuthService, useValue: authServiceMock},
						{provide: ObMasterLayoutService, useValue: {layout: {hasMainNavigation: undefined}}}
					]
				}).compileComponents();
				fixture = TestBed.createComponent(AppComponent);
				app = fixture.componentInstance;
			})
		);

		it('should create the app', () => {
			expect(app).toBeTruthy();
		});

		describe('isAuthenticated$', () => {
			it('should be defined', () => {
				expect(app.isAuthenticated$).toBeDefined();
			});

			it('should output a boolean', done => {
				app.isAuthenticated$.subscribe(isAuthenticated => {
					expect(isAuthenticated).toBe(false);
					done();
				});
			});

			it('should disable the main navigation', done => {
				const config = TestBed.inject(ObMasterLayoutService);
				app.isAuthenticated$.subscribe(() => {
					expect(config.layout.hasMainNavigation).toBe(false);
					done();
				});
			});
		});
	});
});
