// to run use `browserify src/test_light.js -o bundle.js` and then open index.html in a browser

const snarkjs = require("snarkjs");
const groth = snarkjs["groth"];
const bigInt = require("snarkjs").bigInt;

function unstringifyBigInts(o) {
  if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
    return bigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res = {};
    for (let k in o) {
      res[k] = unstringifyBigInts(o[k]);
    }
    return res;
  } else {
    return o;
  }
}

const circuit = new snarkjs.Circuit(unstringifyBigInts(require('../circuit/compiled/Transaction.json')));
const prover = unstringifyBigInts(require('../circuit/compiled/Transaction_proving_key.json'));
const verifier = unstringifyBigInts(require('../circuit/compiled/Transaction_verification_key.json'));

const input = { "owner": "1041671547303485767885768296056150083399484898187",
  "in_salt":
  [ "1892763774189863699862945455769288",
    "765233056052536773322188521779199" ],
    "all_in_hashes":
  [ "80084422859880547211683076133703299733277748156566366325829078699459944778998",
    "111414077815863400510004064629973595961579173665589224203503662149373724986687",
    "17920921729097987027129795720167763718131265429430329074133567035533259344425",
    "16257823677331141776697950249240007477883752359522810398023830800798607823119",
    "75276140696391174450305814049576319106646922510300487059720162673006384432776",
    "4880154688678313337533071380012051060974252050252705329318401353569017185511",
    "19840845117336500942322019029078429558849857675619427891481765607711635919821",
    "11100211004166219303263240437403051342524187674237836065858021589431092266833",
    "62514009886607029107290561805838585334079798074568712924583230797734656856475",
    "16523082879147429078078300777356814439502348556954619790159429991691881401912" ],
    "out_hash":
  [ "8093804524723670753512070949059644646219210310797466655511051705945924933134",
    "10549147904051963125753062539873307571918246094572332540210758190074969380974" ],
    "in_selector":
  [ [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ] ],
    "in_balance": [ "10000000000000000", "10000000000000000" ],
  "out_balance": [ "10000000000000000", 0 ],
  "out_salt":
  [ "630066699414700599377940843753792",
    "2091484447763081088678993034204000" ],
    "out_owner":
  [ "1028026452731494152984443344527682955860287188711",
    "222199755505088003645100184580571886751664372210" ] };

console.log("input:\n", input);
const witness = circuit.calculateWitness(input);
const data = groth.genProof(prover, witness);
console.log("proof:\n", data);
const valid = groth.isValid(verifier, data.proof, data.publicSignals);
alert("valid: " + valid);

// honor view 20