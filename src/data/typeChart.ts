export const TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
] as const;

export type PokemonType = typeof TYPES[number];

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC',
};

export const TYPE_LABELS: Record<PokemonType, string> = {
  Normal: 'ノーマル',
  Fire: 'ほのお',
  Water: 'みず',
  Electric: 'でんき',
  Grass: 'くさ',
  Ice: 'こおり',
  Fighting: 'かくとう',
  Poison: 'どく',
  Ground: 'じめん',
  Flying: 'ひこう',
  Psychic: 'エスパー',
  Bug: 'むし',
  Rock: 'いわ',
  Ghost: 'ゴースト',
  Dragon: 'ドラゴン',
  Dark: 'あく',
  Steel: 'はがね',
  Fairy: 'フェアリー',
};

// TYPE_CHART[attacking][defending] = multiplier (Gen 6+)
export const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  Normal:   { Normal:1, Fire:1, Water:1, Electric:1, Grass:1, Ice:1, Fighting:1, Poison:1, Ground:1, Flying:1, Psychic:1, Bug:1, Rock:0.5, Ghost:0, Dragon:1, Dark:1, Steel:0.5, Fairy:1 },
  Fire:     { Normal:1, Fire:0.5, Water:0.5, Electric:1, Grass:2, Ice:2, Fighting:1, Poison:1, Ground:1, Flying:1, Psychic:1, Bug:2, Rock:0.5, Ghost:1, Dragon:0.5, Dark:1, Steel:2, Fairy:1 },
  Water:    { Normal:1, Fire:2, Water:0.5, Electric:1, Grass:0.5, Ice:1, Fighting:1, Poison:1, Ground:2, Flying:1, Psychic:1, Bug:1, Rock:2, Ghost:1, Dragon:0.5, Dark:1, Steel:1, Fairy:1 },
  Electric: { Normal:1, Fire:1, Water:2, Electric:0.5, Grass:0.5, Ice:1, Fighting:1, Poison:1, Ground:0, Flying:2, Psychic:1, Bug:1, Rock:1, Ghost:1, Dragon:0.5, Dark:1, Steel:1, Fairy:1 },
  Grass:    { Normal:1, Fire:0.5, Water:2, Electric:1, Grass:0.5, Ice:1, Fighting:1, Poison:0.5, Ground:2, Flying:0.5, Psychic:1, Bug:0.5, Rock:2, Ghost:1, Dragon:0.5, Dark:1, Steel:0.5, Fairy:1 },
  Ice:      { Normal:1, Fire:0.5, Water:0.5, Electric:1, Grass:2, Ice:0.5, Fighting:1, Poison:1, Ground:2, Flying:2, Psychic:1, Bug:1, Rock:1, Ghost:1, Dragon:2, Dark:1, Steel:0.5, Fairy:1 },
  Fighting: { Normal:2, Fire:1, Water:1, Electric:1, Grass:1, Ice:2, Fighting:1, Poison:0.5, Ground:1, Flying:0.5, Psychic:0.5, Bug:0.5, Rock:2, Ghost:0, Dragon:1, Dark:2, Steel:2, Fairy:0.5 },
  Poison:   { Normal:1, Fire:1, Water:1, Electric:1, Grass:2, Ice:1, Fighting:1, Poison:0.5, Ground:0.5, Flying:1, Psychic:1, Bug:1, Rock:0.5, Ghost:0.5, Dragon:1, Dark:1, Steel:0, Fairy:2 },
  Ground:   { Normal:1, Fire:2, Water:1, Electric:2, Grass:0.5, Ice:1, Fighting:1, Poison:2, Ground:1, Flying:0, Psychic:1, Bug:0.5, Rock:2, Ghost:1, Dragon:1, Dark:1, Steel:2, Fairy:1 },
  Flying:   { Normal:1, Fire:1, Water:1, Electric:0.5, Grass:2, Ice:1, Fighting:2, Poison:1, Ground:1, Flying:1, Psychic:1, Bug:2, Rock:0.5, Ghost:1, Dragon:1, Dark:1, Steel:0.5, Fairy:1 },
  Psychic:  { Normal:1, Fire:1, Water:1, Electric:1, Grass:1, Ice:1, Fighting:2, Poison:2, Ground:1, Flying:1, Psychic:0.5, Bug:1, Rock:1, Ghost:1, Dragon:1, Dark:0, Steel:1, Fairy:1 },
  Bug:      { Normal:1, Fire:0.5, Water:1, Electric:1, Grass:2, Ice:1, Fighting:0.5, Poison:0.5, Ground:1, Flying:0.5, Psychic:2, Bug:1, Rock:1, Ghost:0.5, Dragon:1, Dark:2, Steel:0.5, Fairy:0.5 },
  Rock:     { Normal:1, Fire:2, Water:1, Electric:1, Grass:1, Ice:2, Fighting:0.5, Poison:1, Ground:0.5, Flying:2, Psychic:1, Bug:2, Rock:1, Ghost:1, Dragon:1, Dark:1, Steel:0.5, Fairy:1 },
  Ghost:    { Normal:0, Fire:1, Water:1, Electric:1, Grass:1, Ice:1, Fighting:1, Poison:1, Ground:1, Flying:1, Psychic:2, Bug:1, Rock:1, Ghost:2, Dragon:1, Dark:0.5, Steel:1, Fairy:1 },
  Dragon:   { Normal:1, Fire:1, Water:1, Electric:1, Grass:1, Ice:1, Fighting:1, Poison:1, Ground:1, Flying:1, Psychic:1, Bug:1, Rock:1, Ghost:1, Dragon:2, Dark:1, Steel:0.5, Fairy:0 },
  Dark:     { Normal:1, Fire:1, Water:1, Electric:1, Grass:1, Ice:1, Fighting:0.5, Poison:1, Ground:1, Flying:1, Psychic:2, Bug:1, Rock:1, Ghost:2, Dragon:1, Dark:0.5, Steel:1, Fairy:0.5 },
  Steel:    { Normal:1, Fire:0.5, Water:0.5, Electric:0.5, Grass:1, Ice:2, Fighting:1, Poison:1, Ground:1, Flying:1, Psychic:1, Bug:1, Rock:2, Ghost:1, Dragon:1, Dark:1, Steel:0.5, Fairy:2 },
  Fairy:    { Normal:1, Fire:0.5, Water:1, Electric:1, Grass:1, Ice:1, Fighting:2, Poison:0.5, Ground:1, Flying:1, Psychic:1, Bug:1, Rock:1, Ghost:1, Dragon:2, Dark:2, Steel:0.5, Fairy:1 },
};

export function getEffectiveness(attackingType: PokemonType, defendingTypes: PokemonType[]): number {
  return defendingTypes.reduce((multiplier, defType) => {
    return multiplier * TYPE_CHART[attackingType][defType];
  }, 1);
}

export function getDefensiveMatchups(defendingTypes: PokemonType[]): {
  weaknesses4x: PokemonType[];
  weaknesses2x: PokemonType[];
  resistances: PokemonType[];
  resistances4x: PokemonType[];
  immunities: PokemonType[];
} {
  const weaknesses4x: PokemonType[] = [];
  const weaknesses2x: PokemonType[] = [];
  const resistances: PokemonType[] = [];
  const resistances4x: PokemonType[] = [];
  const immunities: PokemonType[] = [];

  for (const attackType of TYPES) {
    const mult = getEffectiveness(attackType, defendingTypes);
    if (mult === 0) immunities.push(attackType);
    else if (mult === 0.25) resistances4x.push(attackType);
    else if (mult < 1) resistances.push(attackType);
    else if (mult === 4) weaknesses4x.push(attackType);
    else if (mult > 1) weaknesses2x.push(attackType);
  }

  return { weaknesses4x, weaknesses2x, resistances, resistances4x, immunities };
}
