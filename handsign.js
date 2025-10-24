import * as fp from "fingerpose";

const Handsigns = {};

// Helper function to create a simple “finger open/closed” letter gesture
function createSign(letter, openFingers = []) {
  const gesture = new fp.GestureDescription(letter);

  const fingers = [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky];
  for (let finger of fingers) {
    if (openFingers.includes(finger)) {
      gesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
    } else {
      gesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    }
  }
  return gesture;
}

// Define very simple templates (not perfect ASL, but recognizable baseline)
Handsigns.aSign = createSign("A", []);
Handsigns.bSign = createSign("B", [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]);
Handsigns.cSign = createSign("C", [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring]);
Handsigns.dSign = createSign("D", [fp.Finger.Index]);
Handsigns.eSign = createSign("E", []);
Handsigns.fSign = createSign("F", [fp.Finger.Index, fp.Finger.Thumb]);
Handsigns.gSign = createSign("G", [fp.Finger.Index]);
Handsigns.hSign = createSign("H", [fp.Finger.Index, fp.Finger.Middle]);
Handsigns.iSign = createSign("I", [fp.Finger.Pinky]);
Handsigns.jSign = createSign("J", [fp.Finger.Pinky]);
Handsigns.kSign = createSign("K", [fp.Finger.Index, fp.Finger.Middle]);
Handsigns.lSign = createSign("L", [fp.Finger.Index, fp.Finger.Thumb]);
Handsigns.mSign = createSign("M", []);
Handsigns.nSign = createSign("N", []);
Handsigns.oSign = createSign("O", [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]);
Handsigns.pSign = createSign("P", [fp.Finger.Index, fp.Finger.Middle]);
Handsigns.qSign = createSign("Q", [fp.Finger.Thumb, fp.Finger.Index]);
Handsigns.rSign = createSign("R", [fp.Finger.Index, fp.Finger.Middle]);
Handsigns.sSign = createSign("S", []);
Handsigns.tSign = createSign("T", []);
Handsigns.uSign = createSign("U", [fp.Finger.Index, fp.Finger.Middle]);
Handsigns.vSign = createSign("V", [fp.Finger.Index, fp.Finger.Middle]);
Handsigns.wSign = createSign("W", [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring]);
Handsigns.xSign = createSign("X", [fp.Finger.Index]);
Handsigns.ySign = createSign("Y", [fp.Finger.Thumb, fp.Finger.Pinky]);
Handsigns.zSign = createSign("Z", [fp.Finger.Index]);

export default Handsigns;
