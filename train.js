const fs = require('fs');
const path = require('path');

let MongoClient = null;
try {
  MongoClient = require('mongodb').MongoClient;
} catch (e) {
  MongoClient = null;
}

const DATA_DIR = path.join(__dirname, 'data');
const EXAMPLES_PATH = path.join(DATA_DIR, 'examples.json');
const MODEL_PATH = path.join(DATA_DIR, 'model.json');

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'xauusd_ai_terminal';

const FEATURES = [
  'htfBias',
  'bosChoCh',
  'liquiditySweep',
  'orderBlock',
  'fvg',
  'oteZone',
  'killzone',
  'smtDivergence',
  'deltaPressure',
  'absorption'
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function generateSeedExamples() {
  return [
    // 12 High-Confluence WIN Setups (label: 1)
    { id: 1, direction: 'BUY', features: { htfBias: 0.9, bosChoCh: 1.0, liquiditySweep: 0.95, orderBlock: 0.85, fvg: 0.9, oteZone: 0.8, killzone: 1.0, smtDivergence: 0.75, deltaPressure: 0.85, absorption: 0.9 }, label: 1, note: 'NY Killzone SSL sweep + Bullish CHoCH + FVG/OB in OTE' },
    { id: 2, direction: 'SELL', features: { htfBias: 0.85, bosChoCh: 0.9, liquiditySweep: 1.0, orderBlock: 0.9, fvg: 0.85, oteZone: 0.9, killzone: 1.0, smtDivergence: 0.8, deltaPressure: 0.75, absorption: 0.85 }, label: 1, note: 'London BSL sweep + Bearish BOS + XAU/XAG SMT divergence' },
    { id: 3, direction: 'BUY', features: { htfBias: 0.8, bosChoCh: 0.85, liquiditySweep: 0.9, orderBlock: 0.8, fvg: 1.0, oteZone: 0.75, killzone: 1.0, smtDivergence: 0.65, deltaPressure: 0.9, absorption: 0.8 }, label: 1, note: 'London Open displacement FVG + strong buyer absorption' },
    { id: 4, direction: 'SELL', features: { htfBias: 0.95, bosChoCh: 0.8, liquiditySweep: 0.85, orderBlock: 0.95, fvg: 0.8, oteZone: 0.85, killzone: 1.0, smtDivergence: 0.9, deltaPressure: 0.8, absorption: 0.75 }, label: 1, note: 'HTF Bearish OB mitigation + NY Open SMT confirmation' },
    { id: 5, direction: 'BUY', features: { htfBias: 0.75, bosChoCh: 0.95, liquiditySweep: 1.0, orderBlock: 0.75, fvg: 0.85, oteZone: 0.9, killzone: 0.8, smtDivergence: 0.7, deltaPressure: 0.8, absorption: 0.95 }, label: 1, note: 'Equal lows sweep + pinbar absorption + 70.5% OTE entry' },
    { id: 6, direction: 'SELL', features: { htfBias: 0.9, bosChoCh: 0.9, liquiditySweep: 0.8, orderBlock: 0.85, fvg: 0.95, oteZone: 0.8, killzone: 1.0, smtDivergence: 0.75, deltaPressure: 0.85, absorption: 0.8 }, label: 1, note: 'NY AM session bearish displacement FVG + negative delta' },
    { id: 7, direction: 'BUY', features: { htfBias: 0.85, bosChoCh: 0.8, liquiditySweep: 0.85, orderBlock: 0.9, fvg: 0.75, oteZone: 0.85, killzone: 1.0, smtDivergence: 0.85, deltaPressure: 0.75, absorption: 0.85 }, label: 1, note: 'Silver held higher low while Gold swept SSL + Bullish OB' },
    { id: 8, direction: 'SELL', features: { htfBias: 0.8, bosChoCh: 1.0, liquiditySweep: 0.9, orderBlock: 0.8, fvg: 0.9, oteZone: 0.7, killzone: 0.9, smtDivergence: 0.8, deltaPressure: 0.9, absorption: 0.85 }, label: 1, note: 'Asian high sweep at London open + aggressive seller delta' },
    { id: 9, direction: 'BUY', features: { htfBias: 0.95, bosChoCh: 0.85, liquiditySweep: 0.75, orderBlock: 0.85, fvg: 0.9, oteZone: 0.95, killzone: 1.0, smtDivergence: 0.6, deltaPressure: 0.85, absorption: 0.75 }, label: 1, note: 'HTF uptrend continuation OTE 0.705 + unmitigated 15m FVG' },
    { id: 10, direction: 'SELL', features: { htfBias: 0.85, bosChoCh: 0.85, liquiditySweep: 0.95, orderBlock: 0.9, fvg: 0.8, oteZone: 0.8, killzone: 1.0, smtDivergence: 0.85, deltaPressure: 0.8, absorption: 0.9 }, label: 1, note: 'PDH liquidity raid + exhausted buying wick absorption' },
    { id: 11, direction: 'BUY', features: { htfBias: 0.7, bosChoCh: 0.9, liquiditySweep: 0.95, orderBlock: 0.85, fvg: 0.85, oteZone: 0.8, killzone: 1.0, smtDivergence: 0.9, deltaPressure: 0.8, absorption: 0.85 }, label: 1, note: 'Full ICT confluence reversal from NY session low' },
    { id: 12, direction: 'SELL', features: { htfBias: 0.9, bosChoCh: 0.95, liquiditySweep: 0.85, orderBlock: 0.8, fvg: 0.9, oteZone: 0.85, killzone: 0.9, smtDivergence: 0.7, deltaPressure: 0.95, absorption: 0.8 }, label: 1, note: 'Strong bearish orderflow break + FVG retest in OTE' },

    // 12 Low-Confluence / Counter-Trend LOSS Setups (label: 0)
    { id: 13, direction: 'BUY', features: { htfBias: -0.8, bosChoCh: -0.4, liquiditySweep: -0.5, orderBlock: 0.2, fvg: 0.3, oteZone: -0.3, killzone: -0.8, smtDivergence: -0.5, deltaPressure: -0.6, absorption: -0.4 }, label: 0, note: 'Counter-trend buy in Asian deadzone without sweep' },
    { id: 14, direction: 'SELL', features: { htfBias: -0.7, bosChoCh: 0.1, liquiditySweep: -0.6, orderBlock: -0.2, fvg: 0.2, oteZone: -0.5, killzone: -0.7, smtDivergence: -0.4, deltaPressure: -0.5, absorption: -0.3 }, label: 0, note: 'Chasing bearish candle without liquidity sweep or OTE' },
    { id: 15, direction: 'BUY', features: { htfBias: -0.5, bosChoCh: -0.6, liquiditySweep: 0.1, orderBlock: -0.4, fvg: -0.3, oteZone: -0.6, killzone: 0.2, smtDivergence: -0.7, deltaPressure: -0.8, absorption: -0.5 }, label: 0, note: 'Buying into heavy bearish delta & opposing HTF bias' },
    { id: 16, direction: 'SELL', features: { htfBias: -0.9, bosChoCh: -0.5, liquiditySweep: -0.3, orderBlock: 0.1, fvg: -0.2, oteZone: -0.4, killzone: -0.5, smtDivergence: -0.6, deltaPressure: -0.7, absorption: -0.6 }, label: 0, note: 'Shorting strong HTF Gold breakout without SMT or sweep' },
    { id: 17, direction: 'BUY', features: { htfBias: 0.2, bosChoCh: -0.5, liquiditySweep: -0.7, orderBlock: -0.3, fvg: 0.1, oteZone: -0.7, killzone: -0.9, smtDivergence: -0.3, deltaPressure: -0.4, absorption: -0.5 }, label: 0, note: 'Mid-range entry outside Killzone, swept as liquidity' },
    { id: 18, direction: 'SELL', features: { htfBias: -0.4, bosChoCh: -0.7, liquiditySweep: -0.4, orderBlock: -0.5, fvg: -0.4, oteZone: -0.2, killzone: 0.3, smtDivergence: -0.5, deltaPressure: -0.6, absorption: -0.7 }, label: 0, note: 'No BOS/CHoCH confirmation, buyers absorbed dip' },
    { id: 19, direction: 'BUY', features: { htfBias: -0.6, bosChoCh: 0.2, liquiditySweep: -0.8, orderBlock: -0.2, fvg: -0.5, oteZone: -0.4, killzone: -0.6, smtDivergence: -0.8, deltaPressure: -0.3, absorption: -0.4 }, label: 0, note: 'Equal lows left un-swept below entry, stop hunted' },
    { id: 20, direction: 'SELL', features: { htfBias: 0.1, bosChoCh: -0.3, liquiditySweep: -0.5, orderBlock: -0.6, fvg: -0.1, oteZone: -0.8, killzone: -0.4, smtDivergence: -0.4, deltaPressure: -0.5, absorption: -0.2 }, label: 0, note: 'Weak structure, sold at discount instead of premium OTE' },
    { id: 21, direction: 'BUY', features: { htfBias: -0.3, bosChoCh: -0.2, liquiditySweep: -0.4, orderBlock: 0.1, fvg: -0.6, oteZone: -0.3, killzone: -0.8, smtDivergence: -0.2, deltaPressure: -0.7, absorption: -0.6 }, label: 0, note: 'Low volume chop, no institutional footprint' },
    { id: 22, direction: 'SELL', features: { htfBias: -0.75, bosChoCh: -0.4, liquiditySweep: 0.2, orderBlock: -0.3, fvg: -0.5, oteZone: -0.5, killzone: -0.3, smtDivergence: -0.7, deltaPressure: -0.4, absorption: -0.5 }, label: 0, note: 'Fake sweep without displacement or FVG creation' },
    { id: 23, direction: 'BUY', features: { htfBias: -0.65, bosChoCh: -0.8, liquiditySweep: -0.3, orderBlock: -0.5, fvg: -0.2, oteZone: -0.6, killzone: 0.1, smtDivergence: -0.5, deltaPressure: -0.85, absorption: -0.7 }, label: 0, note: 'Knife-catching during high-impact bearish expansion' },
    { id: 24, direction: 'SELL', features: { htfBias: -0.5, bosChoCh: -0.6, liquiditySweep: -0.6, orderBlock: -0.4, fvg: -0.3, oteZone: -0.4, killzone: -0.7, smtDivergence: -0.6, deltaPressure: -0.5, absorption: -0.8 }, label: 0, note: 'Off-session entry against strong buyer absorption' }
  ];
}

function sigmoid(z) {
  if (z > 20) return 1;
  if (z < -20) return 0;
  return 1 / (1 + Math.exp(-z));
}

function computeLogisticRegression(examples, epochs = 600, learningRate = 0.15, l2Lambda = 0.005) {
  const weights = {};
  FEATURES.forEach(f => { weights[f] = 0.1; });
  let bias = 0.0;
  const n = examples.length || 1;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradW = {};
    FEATURES.forEach(f => { gradW[f] = 0; });
    let gradB = 0;

    for (const ex of examples) {
      let z = bias;
      for (const f of FEATURES) {
        const val = Math.max(-1, Math.min(1, Number(ex.features?.[f] || 0)));
        z += weights[f] * val;
      }
      const pred = sigmoid(z);
      const y = ex.label ? 1 : 0;
      const err = pred - y;

      for (const f of FEATURES) {
        const val = Math.max(-1, Math.min(1, Number(ex.features?.[f] || 0)));
        gradW[f] += err * val;
      }
      gradB += err;
    }

    for (const f of FEATURES) {
      weights[f] -= learningRate * ((gradW[f] / n) + l2Lambda * weights[f]);
      weights[f] = Number(weights[f].toFixed(6));
    }
    bias -= learningRate * (gradB / n);
    bias = Number(bias.toFixed(6));
  }

  let correct = 0;
  let totalLoss = 0;
  let winSamples = 0;
  for (const ex of examples) {
    let z = bias;
    for (const f of FEATURES) {
      z += weights[f] * Number(ex.features?.[f] || 0);
    }
    const p = sigmoid(z);
    const y = ex.label ? 1 : 0;
    if (y === 1) winSamples++;
    if ((p >= 0.5 && y === 1) || (p < 0.5 && y === 0)) correct++;
    const clippedP = Math.min(0.999999, Math.max(0.000001, p));
    totalLoss += -(y * Math.log(clippedP) + (1 - y) * Math.log(1 - clippedP));
  }

  return {
    version: '3.0.0',
    instrument: 'FOREXCOM:XAUUSD',
    epochs,
    sampleCount: examples.length,
    winSamples,
    lossSamples: examples.length - winSamples,
    datasetWinRate: Number(((winSamples / n) * 100).toFixed(1)),
    accuracy: Number(((correct / n) * 100).toFixed(2)),
    loss: Number((totalLoss / n).toFixed(5)),
    trainedAt: new Date().toISOString(),
    features: FEATURES,
    weights,
    bias
  };
}

// Train using local JSON files (synchronous fallback & local cache)
function trainModel(epochs = 600, customExamples = null) {
  ensureDataDir();

  let examples = customExamples;
  if (!Array.isArray(examples) || examples.length === 0) {
    if (!fs.existsSync(EXAMPLES_PATH)) {
      examples = generateSeedExamples();
      fs.writeFileSync(EXAMPLES_PATH, JSON.stringify(examples, null, 2), 'utf8');
    } else {
      try {
        examples = JSON.parse(fs.readFileSync(EXAMPLES_PATH, 'utf8'));
      } catch (err) {
        examples = generateSeedExamples();
      }
    }
  } else {
    fs.writeFileSync(EXAMPLES_PATH, JSON.stringify(examples, null, 2), 'utf8');
  }

  const modelData = computeLogisticRegression(examples, epochs);
  fs.writeFileSync(MODEL_PATH, JSON.stringify(modelData, null, 2), 'utf8');
  console.log(`[train.js] Trained Model (${epochs} epochs) | Samples: ${examples.length} | Accuracy: ${modelData.accuracy}%`);
  return modelData;
}

// Train & Sync directly with MongoDB Atlas if MONGODB_URI is provided
async function trainModelWithMongo(epochs = 600) {
  ensureDataDir();
  if (!MONGODB_URI || !MongoClient) {
    return trainModel(epochs);
  }

  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 6000 });
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const examplesCol = db.collection('examples');
    const modelCol = db.collection('model_weights');

    let examples = await examplesCol.find({}).toArray();
    if (examples.length === 0) {
      const seeds = generateSeedExamples();
      await examplesCol.insertMany(seeds);
      examples = seeds;
      console.log(`[train.js] Seeded ${seeds.length} setups into MongoDB Atlas.`);
    }

    const modelData = trainModel(epochs, examples);
    await modelCol.updateOne(
      { _id: 'current_model' },
      { $set: modelData },
      { upsert: true }
    );
    console.log(`[train.js] Synced trained model weights to MongoDB Atlas!`);
    return modelData;
  } catch (err) {
    console.warn(`[train.js] MongoDB connection fallback to local JSON:`, err.message);
    return trainModel(epochs);
  } finally {
    await client.close().catch(() => {});
  }
}

if (require.main === module) {
  trainModelWithMongo(600).catch(console.error);
}

module.exports = {
  trainModel,
  trainModelWithMongo,
  generateSeedExamples,
  FEATURES,
  EXAMPLES_PATH,
  MODEL_PATH,
  DATA_DIR,
  MONGODB_URI,
  DB_NAME
};