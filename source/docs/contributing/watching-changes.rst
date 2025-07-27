# Watching changes

This document describes different ways to stay up-to-date on the changes being made to the WPILib suite.

## Stages of development

To provide context about the different ways to stay up to date, below are the stages of development in the typical order:

- **Discord**: The [Unofficial FIRST Robotics Competition Discord Server](https://discord.com/invite/frc) contains a programming discussion channel where people bring up their initial ideas and then receive feedback on them, either fleshing them out or learning why they might not be good ideas. It is a popular location for quick iteration because of the live messaging nature of the platform and the number of WPILib developers who are active there. (Conversely, it can be tricky to read because of side conversations and sheer volume of messages, and the live messaging nature of the platform can lead to poorly thought out messages.) Most of the major changes will have some discussion in here, but not all.
- **GitHub issue**: Issues on the relevant GitHub repository provide wider visibility and better searchability and organization compared to Discord. If the idea has gone through Discord, then this simply presents the fleshed out idea; Otherwise, this presents the idea and sometimes get initial discussion. Sometimes changes will skip this step and move straight to a pull request.
- **GitHub design document**: Very major changes will first create a design doc in a pull request to the relevant GitHub repository. Compared to a GitHub issue, a design doc provides a more specific and detailed description of both the changes and the throught process. Only very major features or changes will create a design doc, and sometimes a design doc is included in the pull request implementing the changes.
- **GitHub pull request**: A pull request implements the changes and gets reviewed by members of the WPILib team. Every change is implemented through a pull request.
- **GitHub commits**: After a pull request is reviewed and merged, it shows up in the list of commits to that repository. Every change will show up in the commit list of the relevant branch.
- **Release notes**: New releases are accompanied by release notes, which summarize all of the changes made since the previous release with links to the pull requests implementing them. There is also :doc:`a yearly changelog </docs/yearly-overview/yearly-changelog>` summarizing the changes made between years.
- **Beta testing**: Between competition seasons are beta periods where teams can test the new changes, providing feedback about bugs or ways to improve the team experience.

Occassionally, these events will happen out of order, most commonly when people use Discord to discuss a GitHub design document or pull request.

## Different ways to be involved

Below are some common ways people might want to be interact with upcoming changes and how they can do so.

### Discussing proposed changes

If you want to provide feedback as soon as possible about proposed changes, you will need to be active where the initial discussion happens. This initial discussion usually happens in the Unofficial FIRST Robotics Competition Discord Server, but sometimes it happens in GitHub issues or directly in GitHub pull requests.

### Viewing in-progress changes

If you want to see all changes being made, you can watch the pull requests. (Note that every change must be implemented through a GitHub pull request.)

There are two useful tools for watching pull requests or issues:

- The GitHub issues and pull requests pages provide a ``updated:>=YYYY-MM-DD`` filter that shows changes made since a particular date. If you record the last day you checked, you can ensure you catch up on all issues or pull requests.
- The GitHub repository page provides a [watch feature](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) that allows you to subscribe to notifications on that repository. To select just issues and/or pull requests, select the "Custom" option.

### Seeing implemented changes

If you want to stay up to date on what changes have been made, you have two options based on how often you want to check. To see new changes as soon as possible, check the commit history of the active branches. Commits tend to be made in batches, so most days there are no new commits, making this very low effort. For an even lower effort method, you can check the release notes or yearly changelog.

### Testing changes

If you want to test the new changes for the upcoming season, you can test out the beta versions. It is also possible to test out the changes before the beta period starts, but it takes more work. See [Using Development Builds](https://github.com/wpilibsuite/allwpilib/blob/main/DevelopmentBuilds.md) on the allwpilib repository for details.

## Quick links

Below are some useful links for staying up to date:

- [WPILib issues page](https://github.com/wpilibsuite/allwpilib/issues)
- [WPILib pull requests page](https://github.com/wpilibsuite/allwpilib/pulls)
- [WPILib commits to main](https://github.com/wpilibsuite/allwpilib/commits/main/)
- [WPILib releases page](https://github.com/wpilibsuite/allwpilib/tags)
