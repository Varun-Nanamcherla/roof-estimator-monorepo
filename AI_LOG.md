# AI Usage Log

## Tools Used
- Cursor / Claude 3.5 Sonnet

## Notable Corrections
- **Issue**: Initial AI prompt suggested generating estimate ranges on the client side using cached rate objects.
- **Correction**: Manually isolated calculation logic into `server/src/services/calculator.js` to protect proprietary rates and prevent calculation tampering.
- **Issue**: Multiplier string `"1.12"` in seed data caused string concatenation instead of numeric math.
- **Correction**: Sanitized data ingestion in `seed.js` and forced `Number()` parsing in the calculation engine.

## Code Directly Authored / Reworked
- Database connection lifecycle management and error recovery.
- Responsive design styling in `EstimatorWizard.jsx` and `LeadTable.jsx`.