// Curated culinary word banks for Kitchen Chaos: Chef Cutter (The Golden Butter Edition)

export const FOOD_WORDS_BY_LENGTH: Record<number, string[]> = {
  3: [
    'fig', 'pea', 'yam', 'nut', 'oil', 'pan', 'wok', 'egg', 'tea', 'pie', 'dip', 'bun', 'jam', 'rye', 'ham', 'soy', 'ice', 'bar'
  ],
  4: [
    'lime', 'pear', 'plum', 'corn', 'bean', 'rice', 'herb', 'soup', 'stew', 'beef', 'cake', 'tart', 'taco', 'mint', 'bake', 'melt', 'roast', 'sear', 'zest', 'chop', 'dill', 'kale', 'curd', 'flax', 'tofu', 'beet'
  ],
  5: [
    'apple', 'berry', 'lemon', 'onion', 'grape', 'bread', 'pasta', 'sauce', 'steak', 'pizza', 'toast', 'broth', 'curry', 'crust', 'basil', 'honey', 'melon', 'cream', 'sugar', 'spice', 'clove', 'mango', 'peach', 'guava', 'olive', 'thyme'
  ],
  6: [
    'tomato', 'garlic', 'ginger', 'orange', 'butter', 'pepper', 'carrot', 'potato', 'cherry', 'walnut', 'almond', 'celery', 'radish', 'parsnip', 'nutmeg', 'cheese', 'waffle', 'sponge', 'crepes', 'puree', 'simmer', 'blanch'
  ],
  7: [
    'avocado', 'coconut', 'spinach', 'cabbage', 'apricot', 'caramel', 'custard', 'pancake', 'paprika', 'parsley', 'rosemary', 'sausage', 'brioche', 'shallot', 'vanilla', 'vinegar', 'hazelnut', 'cheddar'
  ],
  8: [
    'cucumber', 'eggplant', 'mushroom', 'broccoli', 'zucchini', 'cinnamon', 'hazelnut', 'pistachio', 'espresso', 'baguette', 'sourdough', 'chutney', 'ganache', 'macaron', 'souffle', 'tartlet'
  ],
  9: [
    'pineapple', 'asparagus', 'artichoke', 'blueberry', 'raspberry', 'tangerine', 'mayonnaise', 'coriander', 'croissant', 'guacamole', 'seasoning'
  ],
  10: [
    'watermelon', 'strawberry', 'cauliflower', 'blackberry', 'pomegranate', 'horseradish', 'vinaigrette', 'marmalade', 'bruschetta'
  ]
};

// Words for Oven Bombs (High-danger warning words - player MUST NOT type these!)
export const BOMB_WORDS: string[] = [
  'bomb',
  'danger',
  'kaboom',
  'blast',
  'burn',
  'boom',
  'cinder',
  'heat',
  'inferno',
  'toxic',
  'scorch',
  'fire',
  'oven',
  'flare',
  'hazard',
  'ignite',
  'detonate',
  'scalding',
  'eruption',
  'hazard',
  'blaze',
  'char'
];

// Special words for Golden Butter Bars
export const GOLDEN_BUTTER_WORDS: string[] = [
  'butter',
  'golden',
  'alchemy',
  'churn',
  'velvet',
  'molten',
  'gilded',
  'nectar',
  'creamy',
  'richness'
];

/**
 * Get a random word for a food item based on length constraints
 */
export function getFoodWord(minLen: number = 3, maxLen: number = 7, excludedWords: Set<string> = new Set()): string {
  const availableLengths: number[] = [];
  for (let len = minLen; len <= maxLen; len++) {
    if (FOOD_WORDS_BY_LENGTH[len]) {
      availableLengths.push(len);
    }
  }

  if (availableLengths.length === 0) availableLengths.push(4, 5, 6);

  // Pick random length
  const chosenLen = availableLengths[Math.floor(Math.random() * availableLengths.length)];
  const pool = FOOD_WORDS_BY_LENGTH[chosenLen] || FOOD_WORDS_BY_LENGTH[5];

  // Try to find a word not already active on screen
  const candidates = pool.filter(w => !excludedWords.has(w));
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get a random bomb word
 */
export function getBombWord(excludedWords: Set<string> = new Set()): string {
  const candidates = BOMB_WORDS.filter(w => !excludedWords.has(w));
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return BOMB_WORDS[Math.floor(Math.random() * BOMB_WORDS.length)];
}

/**
 * Get a golden butter word
 */
export function getGoldenButterWord(): string {
  return GOLDEN_BUTTER_WORDS[Math.floor(Math.random() * GOLDEN_BUTTER_WORDS.length)];
}
