/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CardData {
  id: string;
  frontImage: string;
  backImage: string;
  name: string;
}

export type GameState = 'shuffling' | 'selecting' | 'revealing' | 'results';
