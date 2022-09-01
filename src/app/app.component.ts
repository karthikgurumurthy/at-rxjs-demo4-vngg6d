import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';

export interface Country {
  country: string;
  continent: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  continentSelect = new FormControl();
  countrySelect = new FormControl();
  continent$: Observable<string>;
  countries: Array<Country>;
  private COUNTRY_URL =
    'https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json';

  constructor(private http: HttpClient) {
    const country$ = http.get<Country[]>(this.COUNTRY_URL);
    this.continent$ = this.continentSelect.valueChanges.pipe(
      withLatestFrom(country$),
      map(([continent, countries]) => [
        continent,
        countries.filter((c) => c.continent == continent),
      ]),
      tap(([continent, filteredCountries]) => {
        this.countries = filteredCountries;
        this.countrySelect.setValue(filteredCountries[0].country);
      }),
      map(([continent]) => continent.substring(0, 3).toUpperCase())
    );
  }
}
