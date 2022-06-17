import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic([
	{provide: 'HOST', useValue: environment.host},
	{provide: 'NOTIFICATION_HOST', useValue: environment.notificationHost},
	{provide: 'REPORT_HOST', useValue: environment.reportHost},
	{provide: 'EIAM_SELF_ADMIN', useValue: environment.eiamSelfAdmin},
	{provide: 'IS_PRODUCTION', useValue: environment.production},
])
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
