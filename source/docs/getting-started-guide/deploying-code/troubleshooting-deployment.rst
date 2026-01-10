.. include:: <isonum.txt>

# Troubleshooting Deployment

This page covers common issues when deploying code to the roboRIO and how to resolve them.

## Cannot Connect to roboRIO

### Check Physical Connection

1. **Verify Network Connection**
   - Ensure Ethernet or WiFi is properly connected
   - Check that network adapter is enabled
   - Try pinging the roboRIO: ``ping roborio-TEAM-frc.local`` (replace TEAM with your team number)

2. **Check roboRIO Power**
   - Verify roboRIO status LED is lit
   - Ensure robot battery is charged
   - Check that roboRIO is receiving power from PDP/PDH

3. **Verify Robot Radio**
   - Radio should be properly powered and configured
   - Check that radio is programmed with correct team number
   - Verify radio firmware is up to date

### Network Configuration Issues

**Wrong Team Number**:
- Verify team number in ``build.gradle`` matches your actual team number
- Re-deploy with correct team number

**Firewall Blocking**:
- Temporarily disable firewall to test
- Add exception for WPILib tools and ports 1735, 1740, 5800-5810

**DNS Resolution Failure**:
- Try connecting via USB to roboRIO
- Use IP address instead of mDNS name: ``172.22.11.2`` (USB) or ``10.TE.AM.2`` (network)

## Build Failures

### Compilation Errors

**Syntax Errors**:
- Check VS Code Problems panel for specific error messages
- Verify all brackets, parentheses, and semicolons are matched
- Ensure proper imports and class/method declarations

**Missing Dependencies**:
- Verify vendor libraries are properly installed
- Run "WPILib: Manage Vendor Libraries" to check
- Re-add missing vendor JSONs

**Version Mismatches**:
- Ensure all vendor libraries match WPILib version
- Check for beta vs. release version conflicts
- Update all dependencies to compatible versions

### GradleRIO Issues

**Gradle Daemon Failure**:
```bash
./gradlew --stop
./gradlew build
```

**Corrupted Gradle Cache**:
- Delete ``.gradle`` folder in user home directory
- Re-run build to re-download dependencies

**Build Timeout**:
- Check internet connection
- May need to increase timeout in ``build.gradle``
- Try offline build if dependencies are cached

## Deployment Failures

### Code Deploys But Robot Doesn't Start

**Check Driver Station**:
- Open FRC Driver Station
- Look for error messages in console
- Verify robot code status indicator

**View roboRIO Console**:
- In VS Code: "WPILib: Start Tool" → "roboRIO Console"
- Look for Java stack traces or C++ error messages
- Check for missing files or runtime errors

**Check Robot Code**:
- Verify main robot class is properly defined
- Ensure robot extends ``TimedRobot`` or ``CommandBot``
- Check that motor controllers and devices have valid CAN IDs

### Partial Deployment

**Code Uploaded But Won't Run**:
- Check roboRIO web dashboard (http://roborio-TEAM-frc.local)
- Verify sufficient disk space on roboRIO
- Re-image roboRIO if filesystem is corrupted

**Missing Resources**:
- Ensure all required files are in deployment directory
- Check that paths to resources are correct
- Verify resources are included in ``build.gradle``

## Driver Station Issues

### Robot Code Indicator Red or Missing

1. **Verify Code Deployed Successfully**
   - Check VS Code output for "Build Successful"
   - Confirm no error messages during deployment

2. **Restart Robot Code**
   - In Driver Station, click "Restart Robot Code"
   - If that fails, reboot roboRIO (press reset button or power cycle)

3. **Check Communication**
   - Verify Driver Station shows green communication light
   - Ensure computer and robot are on same network
   - Check that firewall isn't blocking FRC Driver Station

### E-Stop or Disabled Issues

**Robot Won't Enable**:
- Check that battery voltage is sufficient (>12V under load)
- Verify no emergency stops are active
- Look for brownout or system errors in Driver Station

**Robot Immediately Disables**:
- Check for code crashes in console output
- Look for CAN bus errors or missing devices
- Verify motor controller CAN IDs match code

## Performance Issues

### Slow Deployment

- Use wired Ethernet connection instead of WiFi
- Close unnecessary applications
- Check network bandwidth usage
- Consider USB connection for initial deployment

### Code Runs Slowly

- Check for infinite loops or blocking code
- Verify periodic functions aren't taking too long
- Use profiling tools to identify bottlenecks
- Check CAN bus utilization isn't too high

## Getting Help

If you're still experiencing issues:

1. **Check Known Issues**: See :doc:`/docs/yearly-overview/known-issues`
2. **Search Documentation**: Use site search for specific error messages
3. **Ask Chief Delphi**: `chiefdelphi.com <https://www.chiefdelphi.com/>`_
4. **WPILib Discord**: Join the community Discord for real-time help
5. **Contact Vendor Support**: For device-specific issues (REV, CTRE, etc.)

## Additional Resources

- :doc:`/docs/software/vscode-overview/viewing-console-output` - Viewing robot logs
- :doc:`/docs/software/driverstation/driver-station` - Driver Station documentation
- :doc:`/docs/yearly-overview/known-issues` - Known issues for current season
