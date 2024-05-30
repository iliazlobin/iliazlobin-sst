# Main Packages
* [Web (Next.js)](https://github.com/iliazlobin/iliazlobin-sst/tree/master/packages/web)
* [Core](https://github.com/iliazlobin/iliazlobin-sst/tree/master/packages/core)
* [Functions](https://github.com/iliazlobin/iliazlobin-sst/tree/master/packages/functions)

# Development

Run deployment for dev:

```bash
pnpm i
pnpm dev
```

Insert secrets:

```sh
# test
apifyBlogProcessToken=$(cat .env | grep apifyBlogProcessToken)
npx sst secrets set apifyBlogProcessToken ${apifyBlogProcessToken#*=}

# exec
notionToken=$(cat .env | grep notionToken)
npx sst secrets set notionToken ${notionToken#*=}
npx sst secrets set --stage prod notionToken ${notionToken#*=}
apifyToken=$(cat .env | grep apifyToken)
npx sst secrets set apifyToken ${apifyToken#*=}
npx sst secrets set --stage prod apifyToken ${apifyToken#*=}
openaiApiKey=$(cat .env | grep openaiApiKey)
npx sst secrets set openaiApiKey ${openaiApiKey#*=}
npx sst secrets set --stage prod openaiApiKey ${openaiApiKey#*=}

```

Run a job for updating data:

```sh
cd packages/core
pnpm test
```

Start a website:

```bash
cd packages/web
pnpm dev
```

# Chrome Debug

- https://embracethered.com/blog/posts/2020/chrome-spy-remote-control/

```sh
netsh interface portproxy reset
netsh interface portproxy add v4tov4 listenaddress=192.168.1.27 listenport=9222 connectaddress=127.0.0.1 connectport=9222
netsh advfirewall firewall add rule name="Open Port 9222" dir=in action=allow protocol=TCP localport=9222
netsh interface portproxy show all
netstat -abn | findstr 9222
nmap -Pn -sT -p 9222 192.168.1.27
# netsh interface portproxy add v4tov4 listenaddress=192.168.1.27 listenport=9080 connectaddress=127.0.0.1
```

# Blog Summarizer Test
```sh
curl -X POST https://tqnqj3hg8b.execute-api.us-east-1.amazonaws.com/blog/process
curl -X POST \
  -H "Authorization: Bearer _____" \
  https://tqnqj3hg8b.execute-api.us-east-1.amazonaws.com/blog/process \

# prod
curl -X POST \
  -d "@packages/functions/blog/files/failing_aws_apify_payload.json" \
  -H "Authorization: Bearer _____" \
  https://cdmujzau4j.execute-api.us-east-1.amazonaws.com/blog/process \

```
