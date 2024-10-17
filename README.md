# Asterisk Caller

Hi, this is a simple Asterisk call flow integration using node js, express and windows built-in tts.

You could use it to request a call to asterisk and play a real time generated audio using Windows TTS API. Could be useful if you want to automate calls at your workplace. A good example scenario would be Zabbix Automated Calls using Asterisk and playing a custom audio for each given problem.


# Requirements
* Node.JS v20.10.0+
* An AGI Server running at Asterisk's server side. The server must know how to deal with the filename and play it at the given call.
* Asterisk AMI enabled. (See asterisk docs about manager.conf)
* Asterisk ARI (http) enabled (See asterisk docs about http.conf)
* A Windows Computer in order to use the Powershell to TTS conversion. You could replace the "createTts()" function by your own implementation (eg. Azure TTS), but you must follow the file generation rules.


## Required Environment Data

You <b>must</b> rename the ".env.example" file to .env and fill the required fields.
* ASTERISK_AMI_USER: AMI username configured at manager.conf
* ASTERISK_AMI_PASSWORD: AMI password configured at manager.conf
* ASTERISK_AMI_HOST: Asterisk Host
* ASTERISK_AMI_PORT: Asterisk AMI Port (Default is 5038)
* ASTERIK_ARI_HOST: Asterisk Host (Should be the same as asterisk ami host)
* ASTERISK_ARI_USER: Asterisk Ari User configured at http.conf
* ASTERISK_ARI_PASSWORD: Asterisk Ari password configured at http.conf
* ASTERISK_ARI_PORT: Asterisk ARI Port (Default is 8088)
* AUDIO_OUTPUT_BASE_PATH: Base Path where TTS Audios will be stored.

## How it works

The application relies at '/tts' route, creating a real time text to speech audio file with the name and description provided at the given output path. The audio file will be generated at .wav format by Windows Powershell, converted to .gsm using fluent-ffmpeg module and saved at the default output path with the name followed by the file creation time.

The generated call has a "fileName" variable that is send to AGI, it reads the call and play the audio. Notice that you must implement the AGI logic at the Asterisk's Server Side, this code is intended to generate a tts file and send its location to Asterisk AGI in order to play the audio file.

The Express Server provides the file at its static route to be consumed by Asterisk.

## Asterisk Endpoints and Calls (AMI)

The caller.js file present at core/calls is the responsible to originate and monitor asterisk calls. It was built considering PJSIP endpoints, so, at the "createCall()" function the code expects the endpoints to be PJSIP. If you want to use other channel types such as chan_sip or local channels, you must configure it properly at that function.

## Why did i choose to use TTS instead of pre-made files?

The big reason is because i wanted the project to be dynamic to fulfill realtime needs. For instance, if you want to call IT Support when a Zabbix Alarm is trigerred, you could make a good use of tts passing the worker's name and alarm/trigger details at the call, it think it makes it much more professional and straightforward.

## Planned Features

The core/call/ari.js file is planned to be used to validate active channels and check if the call can be made before the "createCall()" method is called.

