# Wire Crimping Best Practices

Proper wire crimping is essential for creating reliable electrical connections on your FRC robot. Poor crimps can lead to voltage drops, momentary disconnections, and connection failures that are difficult to diagnose. This guide covers best practices for crimping Anderson Powerpole connectors and other common FRC connectors.

## Why Proper Crimping Matters

A properly crimped connection provides:

- **Low electrical resistance** - Minimizes voltage drop and heat generation
- **Mechanical strength** - Prevents wires from pulling out under vibration
- **Safety** - Reduces risk of shorts and electrical fires

Poor crimps are a common source of mysterious electrical problems. A connection that works on the bench may fail under the vibration and stress of competition.

## Connector Types Used in FRC

Before learning how to crimp, it's important to understand the different connector types commonly used on FRC robots:

### Anderson Powerpole Connectors

Anderson Powerpole connectors are the primary power connectors used in FRC. They feature a genderless design that allows any connector to mate with any other connector of the same size. They come in three amperage ratings:

- **15 amp (PP15-45)** - Used for smaller loads, typically signal wiring or low-current devices
- **30 amp (PP15-45)** - Common for motor controllers and moderate current loads, uses the same housing as 15 amp
- **45 amp (PP15-45)** - Used for higher current applications, uses the same housing as 15 and 30 amp

All three contact sizes fit in the same PP15-45 housing. The contacts are what differ - they accept different wire gauges and have different current ratings.

### Ferrules

Wire ferrules are crimped metal sleeves placed on the end of stranded wire. They provide a solid, uniform tip that works well with screw terminals found on motor controllers (like the Spark MAX), the PDH, and other FRC electronics. Ferrules prevent strand fraying and ensure all wire strands make good contact.

### Ring and Spade Terminals

Ring terminals (closed loop) and spade terminals (open fork) are used for bolt-on connections such as battery terminals and chassis ground points. These terminals are crimped onto wire and then secured with a bolt or screw.

### Wire-to-Board Connectors

Many FRC components use small-pitch connectors like JST, Molex, or Dupont-style for signal wiring. These require specialized crimp contacts and precise wire stripping.

## Required Tools

### Crimping Tools

**Ratcheting Crimpers** (Highly Recommended)

Ratcheting crimpers provide consistent, high-quality crimps by ensuring proper compression force every time. They prevent under-crimping or over-crimping by not releasing until the crimp cycle is complete. Recommended tools include:

- **TRIcrimp** - Designed specifically for Anderson Powerpole connectors (15, 30, and 45 amp)
- **IWISS Powerpole Crimper** - Ratcheting tool for Anderson Powerpole connectors
- **Anderson 1309G3** - Official Anderson Power Products crimping tool

.. important:: Invest in a quality ratcheting crimper. While they cost more initially ($40-100), they produce vastly superior crimps compared to generic wire strippers with crimping dies.

**Manual Crimpers** (Budget Option)

If a ratcheting crimper is not available, quality manual crimpers can work with careful technique. Look for:
- Long handles for leverage
- A formed bump or anvil for proper compression
- Dedicated crimp dies for your connector size

Avoid using generic wire strippers or pliers for crimping - they cannot apply the proper force distribution.

### Wire Stripping Tools

- **Automatic Wire Strippers** - Provide consistent strip length and don't nick conductors
- **Manual Wire Strippers** - Work well with practice; use the correct gauge notch
- **Thermal Wire Strippers** - Used by some teams for high-volume work

### Additional Tools

- **Wire Cutters** - For clean, square cuts
- **Crimping Die Set** - If using a multi-purpose crimping tool
- **Insertion Tool** - Helps seat contacts fully into housings (often built into crimpers)

## Anderson Powerpole Crimping

Anderson Powerpole connectors are the primary power connectors used in FRC robots. Proper crimping technique is critical for these high-current connections.

### Wire Preparation

1. **Cut wire to length** - Plan your wire routing and cut cleanly with wire cutters
2. **Strip insulation** - Strip only the amount needed for the contact

   - **15/30 amp contacts**: Strip approximately 5-6mm (3/16")
   - **45 amp contacts**: Strip approximately 6-7mm (1/4")
   - Do not over-strip - excess exposed conductor can prevent proper seating in the housing

3. **Inspect the conductor** - Ensure no strands are cut or missing

.. tip:: Keep red and black wires in a pair the same length to prevent stress on the connection when routing

### Crimping 15 & 30 Amp Contacts

1. **Insert wire into contact** - Push the stripped wire fully into the crimp barrel
2. **Orient the contact** - Place in crimper with the **flat side down** and the hook facing away from you
3. **Position in tool** - Insert the contact tip into the appropriate slot (15 or 30 amp marking)
4. **Crimp** - Squeeze the ratcheting handle until it releases automatically
5. **Inspect** - The crimp barrel should be compressed evenly with no gaps

### Crimping 45 Amp Contacts

45 amp contacts have a U-shaped barrel that requires different technique:

1. **Insert wire** - Place stripped wire into the U-shaped barrel
2. **Pre-form** - Pinch the U closed with pliers so the two sides touch
3. **Orient contact** - Place so the crimp bump will press on the seam where the barrel sides meet
4. **Crimp firmly** - Apply maximum force with the crimper
5. **Inspect** - Barrel should be fully closed with even compression

### Inserting Contacts into Housing

After crimping, the contact must be properly seated in the plastic housing:

1. **Orient contact** - Hook side should face **down** (toward the flat side of the housing)
2. **Align** - Line up the contact with the housing cavity
3. **Push firmly** - Insert the contact and crimped wire until you hear/feel a click
4. **Pull test** - Gently tug the wire to verify the contact is locked in place

.. important:: Contacts that are not fully inserted can cause intermittent connections or complete disconnection. Always perform a pull test!

### Common Powerpole Crimping Problems

**Exposed Conductor**
- **Cause**: Too much insulation stripped
- **Effect**: Wire may not seat properly in housing, causing poor connection
- **Fix**: Strip only 5-6mm for 15/30 amp, 6-7mm for 45 amp

**Weak Crimp**
- **Cause**: Under-crimped connection or poor crimper
- **Effect**: Wire pulls out easily, high resistance
- **Fix**: Use ratcheting crimper, ensure full crimp cycle

**Deformed Contact**
- **Cause**: Over-crimped or improperly oriented in tool
- **Effect**: Contact won't insert into housing
- **Fix**: Use ratcheting crimper to prevent over-crimping, verify correct orientation

**Contact Not Seated**
- **Cause**: Not pushed in until it clicks
- **Effect**: Intermittent connection, can disconnect under vibration
- **Fix**: Push firmly until click, perform pull test

## Crimping Best Practices

### General Guidelines

1. **Use the right wire gauge**
   - 15 amp contacts: 16-20 AWG
   - 30 amp contacts: 12-14 AWG
   - 45 amp contacts: 10-12 AWG

2. **Cut cleanly** - Use wire cutters, not pliers. Cuts should be square to the wire

3. **Strip consistently** - Use the same strip length for every crimp of the same type

4. **Inspect every crimp** - Look for even compression, proper insulation support, no gaps

5. **Test the connection**
   - Visual inspection: Crimp should be symmetrical with no gaps
   - Pull test: Gently tug the wire - it should not pull out
   - Resistance test: Use a multimeter to verify low resistance (<10 mΩ for power connections)

### Quality Control

**Visual Inspection Checklist:**

- [ ] Crimp barrel is evenly compressed (not lopsided)
- [ ] Insulation is captured by the insulation crimp wings
- [ ] No conductor strands are visible outside the crimp barrel
- [ ] Contact is not deformed or bent
- [ ] Contact is fully seated in housing (heard click)

**Mechanical Testing:**

Pull on the wire with moderate force (about 5-10 pounds for 16-12 AWG). The wire should not pull out of the crimp, and the contact should not pull out of the housing.

**Electrical Testing:**

For critical high-current connections, use a milliohm meter or multimeter to verify low resistance:
- Power connections: < 10 milliohms
- Signal connections: < 50 milliohms

Higher resistance indicates a poor crimp that should be redone.

### Practice and Training

**Learning Crimping:**

1. **Practice on scrap wire** - Make 10-20 practice crimps before doing real robot wiring
2. **Cut open crimps** - Use wire cutters to see what a good crimp looks like inside
3. **Compare** - Have experienced mentors show examples of good and bad crimps
4. **Test** - Do pull tests and resistance measurements on practice crimps

**Common Learning Mistakes:**

- Rushing the insertion and not seating contacts fully
- Using the wrong crimp die or size on multi-purpose tools
- Not stripping enough (or stripping too much) insulation
- Reusing contacts after a bad crimp (throw it away and start over)
- Not doing pull tests or visual inspection

## Crimping Other Connector Types

### Ferrule Crimping

When crimping ferrules for screw terminal connections:

- Use properly sized ferrules for your wire gauge
- Ferrule crimpers (square or hexagonal) provide better results than generic tools
- Strip wire to match ferrule depth (usually 8-10mm)
- Insert all wire strands into the ferrule before crimping
- Crimp should compress ferrule evenly without deforming it
- Verify no strands are outside the ferrule after crimping

### Ring and Spade Terminal Crimping

When crimping ring or spade terminals:

- Use heat-shrink or insulated terminals to prevent shorts
- Crimp both the conductor barrel and insulation support wings
- Verify terminal hole size matches the stud size (battery terminals are typically 1/4" or M6)
- Apply anti-oxidant compound to copper-aluminum connections
- See :doc:`robot-battery` for detailed battery terminal information

### Wire-to-Board Connector Crimping

When crimping small signal connectors (JST, Molex, Dupont-style):

- Use the manufacturer's specified crimping tool when possible
- Strip very precise lengths (typically 2-3mm for these small connectors)
- Ensure contacts click fully into the housing
- Test continuity after assembly

## Troubleshooting Connection Problems

If you suspect a bad crimp:

1. **Visual inspection** - Look for obvious defects
2. **Wiggle test** - Gently move the wire while monitoring connection
3. **Resistance measurement** - High resistance indicates poor crimp
4. **Thermal imaging** - Bad crimps get hot under load
5. **Remake the connection** - When in doubt, cut it off and redo it

.. important:: Never try to "fix" a bad crimp by soldering it. Solder can wick up into the wire, creating a rigid point that will break due to vibration. Always remake bad crimps properly.

## Competition Preparation

**Before Competition:**

1. **Inspect all connections** - Visual check of every crimp
2. **Pull test critical connections** - Battery, main breaker, PDP/PDH
3. **Resistance check** - Test main power path for excess resistance
4. **Wiggle test** - Check for intermittent connections
5. **Secure wiring** - Use cable ties to prevent wire movement

**At Competition:**

- Bring spare crimp contacts and housings
- Bring your crimping tools
- Have extra wire in common gauges
- Know how to quickly remake connections if problems occur

## Additional Resources

- `Anderson Power Products Assembly Instructions <https://www.andersonpower.com/us/en/products/powerpole-high-current-connectors.html>`__
- `REV Robotics Anderson Connector Guide <https://docs.revrobotics.com/brushless/tips/anderson-connectors>`__
- :doc:`wiring-best-practices` - General wiring guidelines
- :doc:`robot-battery` - Battery connection information
- FRC Tool Recommendations (available on FIRST website)
