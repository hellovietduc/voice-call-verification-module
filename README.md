# voice-call-verification-module
Core module for a Voice Call Verification Service

## Getting Started
#### What Datacard I use?
ZTE MF190 which supports voice-call.

#### What audio standard is using in the audio files?
G.711, μ-law encoding, mono channel, 8000 Hz sample rate.

#### At what rate I send the files?
160 bytes each 20ms, so it's 8 bytes per millisecond.

## Using the module
This module can be used for any other types of datacard which support voice-call, but the signals they return may differ. This can be edited in the constructor of the `device.js` file.

In a real-world program, the module should be implemented like this:
1. Each verification request is placed in a queue with the phone number is the required info.
2. The program takes each phone number and perform voice-call verification.
3. If `rejected` or `notAnswered` events occur, the program executes the next task in the queue.
4. If not, after `hungUp` or `endedCall` events occur, the verification info (phone number and verification code are required) is stored in an array.
5. This verification info is removed after being used by the user, or after an expire time.
