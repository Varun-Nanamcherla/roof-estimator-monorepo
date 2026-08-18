export function calculateEstimate(config, answers) {
  const { questions, modifiers } = config;

  const roofArea = Number(answers['roof_area'] || 0);
  if (roofArea <= 0) {
    throw new Error("Invalid roof area provided.");
  }

  const getSelectedOption = (questionKey) => {
    const q = questions.find(item => item.key === questionKey);
    if (!q || !q.options) return null;
    const val = answers[questionKey];
    return q.options.find(opt => opt.value === val) || null;
  };

  const materialOpt = getSelectedOption('material');
  const pitchOpt = getSelectedOption('pitch');
  const layersOpt = getSelectedOption('layers');
  const storiesOpt = getSelectedOption('stories');

  const ratePerSqft = Number(materialOpt?.rate_per_sqft || 0);
  const pitchMult = Number(pitchOpt?.multiplier || 1.0);
  const tearOffPerSqft = Number(layersOpt?.tear_off_per_sqft || 0);
  const storiesMult = Number(storiesOpt?.multiplier || 1.0);

  const wasteFactor = Number(modifiers.waste_factor || 0.10);
  const permitFee = Number(modifiers.permit_flat_fee || 350);
  const spreadPct = Number(modifiers.range_spread_pct || 12) / 100;

  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const subtotal = (baseMaterialCost + tearOffCost) * pitchMult * storiesMult;
  const midPointEstimate = subtotal + permitFee;

  return {
    estimate_low: Math.round(midPointEstimate * (1 - spreadPct)),
    estimate_high: Math.round(midPointEstimate * (1 + spreadPct))
  };
}