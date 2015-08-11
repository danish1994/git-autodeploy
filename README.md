Auto Re-Deploy
--------------
If you need that the code is auto-deployed on the server whenever someone pushed on the deployed branch, this is very useful and easy lightweight process, just run the following to enable the following on the server:

```bash
# goto project root
cd ~/konveen

cd devOps/tools/git-reload

#start reload deamon

WATCH_BRANCH=master WATCH_PORT=8898 ./start.sh
```
Now add the webhook in the github:
```
http://<your IP, host>:<PORT you entered>
```
All Set. :)
