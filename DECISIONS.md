# Architectural Decisions & Cost Formula

## Stack Justification
- **Frontend**: React (Vite) + Tailwind CSS for zero-delay form rendering and rapid UI scaffolding.
- **Backend**: Node.js + Express for modular REST routing and straightforward Basic Auth middleware.
- **Database**: MongoDB (Mongoose) due to the variable document structure of form questions and answers.

## Pricing Formula
1. `Base Material Cost = Roof Area * Rate Per Sqft * (1 + Waste Factor)`
2. `Tear-Off Cost = Roof Area * Tear-Off Per Sqft`
3. `Adjusted Subtotal = (Base Material Cost + Tear-Off Cost) * Pitch Multiplier * Stories Multiplier`
4. `Midpoint Estimate = Adjusted Subtotal + Permit Flat Fee`
5. `Estimate Low = Midpoint * (1 - Spread %)`
6. `Estimate High = Midpoint * (1 + Spread %)`

## Out of Scope
- Granular Role-Based Access Control (RBAC): Dale and Marcus share admin credentials.
- Dynamic question addition form: Editing existing keys, labels, and rates is prioritized for stability.

## Production Questions for Dale
1. Should customer notifications (email confirmations) fire immediately upon submission?
2. If a question is set to inactive, should existing leads associated with that key maintain visible answers in Marcus's table?