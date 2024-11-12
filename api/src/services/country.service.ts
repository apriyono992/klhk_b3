import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CountryService {
  private countries: any;

  constructor() {
    this.countries = this.readJsonFile();
  }

  private readJsonFile(): any {
    try {
      const filePath = path.join(process.cwd(), 'src/seed/countries.json');
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      throw new Error('Failed to read JSON file');
    }
  }

  getCountryByCode2(code: string) {
    return this.countries.find((country: any) => country.cca2 === code?.toUpperCase()) || undefined;
  }

  getCountryByCode3(code: string) {
    return this.countries.find((country: any) => country.cca3 === code?.toUpperCase()) || undefined;
  }

  getAllCountries() {
    if (!this.countries || !Array.isArray(this.countries)) {
      throw new Error('Countries data not loaded properly.');
    }

    return this.countries.map((country: any) => ({
      code2: country.cca2,
      code3: country.cca3,
      name: country.name.common,
      officialName: country.name.official,
      region: country.region,
      subregion: country.subregion,
      borders: country.borders,
      area: country.area,
      capital: country.capital[0] || undefined,
    }));
  }
}
