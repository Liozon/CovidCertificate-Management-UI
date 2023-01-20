import {Component} from '@angular/core';
import {CacheResetService} from './cache-reset.service';

enum Caches {
	KeyIdentifier= 'KeyIdentifier',
	SigningInformation = 'SigningInformation',
	Rapidtests = 'Rapidtests',
	IssuableRapidtests = 'IssuableRapidtests',
	Vaccines = 'Vaccines',
	IssuableVaccines = 'IssuableVaccines',
	ApiIssuableVaccines = 'ApiIssuableVaccines',
	WebIssuableVaccines = 'WebIssuableVaccines',
	Valuesets = 'Valuesets',
	ExtendedValuesets = 'ExtendedValuesets',
	IssuableVaccineDTO = 'IssuableVaccineDTO',
	IssuableTestDTO = 'IssuableTestDTO',
	CountryCodes = 'CountryCodes',
	CountryCodeByLanguage = 'CountryCodeByLanguage'
}

type Checklist = {value: Caches, isSelected: boolean}[]

@Component({
	selector: 'ec-cache-reset',
	templateUrl: './cache-reset.component.html',
	styleUrls: ['./cache-reset.component.scss']
})
export class CacheResetComponent {
	masterSelected: boolean;
	checklist: Checklist;

	constructor(private readonly cacheResetService: CacheResetService) {
		this.masterSelected = false;
		this.checklist = [
			{value: Caches.KeyIdentifier, isSelected: false},
			{value: Caches.SigningInformation, isSelected: false},
			{value: Caches.Rapidtests, isSelected: false},
			{value: Caches.IssuableRapidtests, isSelected: false},
			{value: Caches.Vaccines, isSelected: false},
			{value: Caches.IssuableVaccines, isSelected: false},
			{value: Caches.ApiIssuableVaccines, isSelected: false},
			{value: Caches.WebIssuableVaccines, isSelected: false},
			{value: Caches.Valuesets, isSelected: false},
			{value: Caches.ExtendedValuesets, isSelected: false},
			{value: Caches.IssuableVaccineDTO, isSelected: false},
			{value: Caches.IssuableTestDTO, isSelected: false},
			{value: Caches.CountryCodes, isSelected: false},
			{value: Caches.CountryCodeByLanguage, isSelected: false}
		];
	}

	checkUncheckAll() {
		for (const value of this.checklist) {
			value.isSelected = this.masterSelected;
		}
	}

	isAllSelected() {
		this.masterSelected = this.checklist.every(item => item.isSelected);
		return this.masterSelected;
	}

	resetCache() {
		this.cacheResetService.resetCache(this.checklist.filter(item => item.isSelected).map(a => a.value));
		this.resetAllCheckboxes();
	}

	resetAllCheckboxes() {
		for (const value of this.checklist) {
			value.isSelected = false;
		}
		this.masterSelected = false;
	}
}
