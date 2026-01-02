import { describe, test, expect } from 'vitest';

import type { Product, ProductComplete } from '$lib/definitions';
import {
  filterToProductFullProperties,
  filterToProductThumbnailProperties
} from '$lib/model/data/product.server';
import {
  expectedProductNapapijri,
  expectedProductNapapijriMin
} from '$lib/model/__tests__/helpers/fixtures';

describe('helper functions tests', () => {
  describe('filterToProductFullProperties', () => {
    test('source object has extra fields', () => {
      // Arrange
      const expectedSourceObject = Object.assign({ foo: 'bar' }, expectedProductNapapijri);

      // Act
      const actualProductComplete: ProductComplete =
        filterToProductFullProperties(expectedSourceObject);

      // Assert
      expect(actualProductComplete).toEqual(expectedProductNapapijri);
    });

    test('source object has missing fields', () => {
      // Arrange
      const { sizes, ...expectedSourceObject } = expectedProductNapapijri;
      void sizes;

      // Act
      const actualProductComplete: ProductComplete =
        filterToProductFullProperties(expectedSourceObject);

      // Assert
      expect(actualProductComplete).toEqual(expectedSourceObject);
    });
  });

  describe('filterToProductThumbnailProperties', () => {
    test('source object has extra fields', () => {
      // Arrange
      const expectedSourceObject = Object.assign({ foo: 'bar' }, expectedProductNapapijriMin);

      // Act
      const actualProduct: Product = filterToProductThumbnailProperties(expectedSourceObject);

      // Assert
      expect(actualProduct).toEqual(expectedProductNapapijriMin);
    });

    test('source object has missing fields', () => {
      // Arrange
      const { photo_url, ...expectedSourceObject } = expectedProductNapapijriMin;
      void photo_url;

      // Act
      const actualProduct: Product = filterToProductThumbnailProperties(expectedSourceObject);

      // Assert
      expect(actualProduct).toEqual(expectedSourceObject);
    });
  });
});
