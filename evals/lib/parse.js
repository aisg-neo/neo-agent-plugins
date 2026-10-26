// Extracts the JSON result from the model output so assertions can read `output.scores`.
// Long results sometimes contain a malformed quote; the scores object is flat, so fall back to it.
module.exports = function (output) {
  const start = output.indexOf('{');
  const end = output.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in output');
  try {
    return JSON.parse(output.slice(start, end + 1));
  } catch (err) {
    const scores = output.match(/"scores"\s*:\s*(\{[^{}]*\})/);
    if (!scores) throw err;
    return { scores: JSON.parse(scores[1]), parse_error: err.message };
  }
};
