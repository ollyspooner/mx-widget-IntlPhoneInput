# International Phone Input

This is a Mendix widget wrapper for the amazing work done at https://github.com/jackocnr/intl-tel-input which itself uses code from https://github.com/google/libphonenumber.

## Installation

Install the widget direct from the App Store or by downloading the widget package into your project widgets directory.

## Usage

The widget converts a normal Mendix Text box widget into a phone number validating widget. To use the widget:
  1. Prepare a page with a text box widget assigned to a string attribute that is to hold a phone number.
  2. Add the widget just after the text box (the location doesn't really matter, but it makes it easier to find).
  3. Give your text box a classname of "internationalPhone" (the classname can be customised in the widget if required).

## Configuration

### Data

#### Text box selector class
This is the class that the widget will use to create the input control. It is expected that this a control with this class will contain a phone number string. It defaults to "internationalPhone".

#### Phone number attributes
These attributes will be updated with formatted phone numbers. You should probably add the same attribute as the one you gave the above classname to (or not, see later). You can pick an attribute from the current context entity and a format to use for each.

### Display

#### Allow dropdown
Whether or not to allow the dropdown. If disabled, there is no dropdown arrow, and the selected flag is not clickable. Also we display the selected flag on the right instead because it is just a marker of state.
            
#### Automatically hide dial code
If there is just a dial code in the input: remove it on blur or submit. This is to prevent just a dial code getting submitted with the form. Requires nationalMode to be set to false.

#### Automatic placeholder
Set the input's placeholder to an example number for the selected country, and update it if the country changes. You can specify the number type using the placeholderNumberType option. By default it is set to "polite", which means it will only set the placeholder if the input doesn't already have one. You can also set it to "aggressive", which will replace any existing placeholder, or "off".

#### Placeholder number type
Specify the type of number for the placeholder.

#### Separate dial code
Display the country dial code next to the selected flag so it's not part of the typed number. Note that this will disable nationalMode because technically we are dealing with international numbers, but with the dial code separated.

### Formatting
#### Format on display
Format the input value (according to the nationalMode option) during initialisation, and on setNumber.

#### National mode
Allow users to enter national numbers (and not have to think about international dial codes). Formatting, validation and placeholders still work. Then you can use getNumber to extract a full international number - see example. This option now defaults to true, and it is recommended that you leave it that way as it provides a better experience for the user.

### Countries
#### Initial country
Slect the couintry to be selected by default. You can also set it to "auto", which will lookup the user's country based on their IP address (requires the geoIpLookup option which may or may not work...). Note that the "auto" option will not update the country selection if the input already contains a number.

#### Preferred countries
Specify the countries to appear at the top of the list.

#### Only include countries
Only show the countries in this list.
* The list must contain the country selected for "Initial country"; and
* Any "Preferred countries" not in this list will not be shown.

#### Exclude countries
In the dropdown, display all countries except the ones you specify here.
* This setting is ignored if "Include countries" is populated; and
* This list must not contain the "Initial country".
            
#### Translate country names
Allows you to provide alternative names for countries by selecting a country and providing a translation.

### Advanced usage

It may be useful to have access to not only the formatted number, but also alternative formats and the number exactly as entered by the user. To achieve this, you can do the following:
  1. Add additional attributes for each formatted number you want to store (in addition to the original one).
  2. In Data/Phone number Attributes, map each of these attributes to a format (do not map the original attribute).

If you like this widget, please consider supporting the developer of the original code. You may also want to [make a donation to ShelterBox](shelterbox.org)!
