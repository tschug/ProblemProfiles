# Problem Profile Editor

Salesforce has a known issue when it comes to managing security on certain profiles.

This Lightning Web Component is designed to help streamline the steps outlined by this [Salesforce Help Article](https://help.salesforce.com/s/articleView?id=000385230&type=1).

Admins will not longer have to disable the `Enhanced Profile User Interface` and then switch to the Salesforce Classic interface.

Instead, this LWC will generate the correct URL to access the Salesforce Classic page for Setup and open it in a new tab.

Ideally, this would be opened within a modal or the Salesforce Lightning interface; however, due to securities, these pages were not able to be placed in an iFrame easily and it was decided to open them in a new tab.

Also, please note that not all sObjects that appear in the search component are applicable to every Profile. In these situations, the new tab will display an error with `Unable to Access Page`.
