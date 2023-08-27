# Valorant API Client Providers

- ### provideLockFile

  Input: <code style="background-color: #B08BBB">lockfilePath(optional)</code> \
  Output: <code style="background-color: #FD8A8A">password</code> <code style="background-color: #FD8A8A">port</code> \
  Used As: `LocalApiClientProvider`

- ### provideLogFile

  Input: <code style="background-color: #B08BBB">logfilePath(optional)</code> \
  Output: <code style="background-color: #AC7088">shard</code> <code style="background-color: #AC7088">region</code> <code style="background-color: #54BAB9">clientVersion</code> \
  Used As: `RemoteApiClientProvider`

- ### provideAuth

  Input: <code style="background-color: #7286D3">username</code> <code style="background-color: #7286D3">password</code> <code style="background-color: #7286D3">mfaCodeProvider(optional)</code>\
  Output: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> \
  Used As: `RemoteApiClientProvider`

- ### provideAuthViaLocalApi

  Input: <code style="background-color: #65647C">none</code> \
  Output: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> \
  Used As: `RemoteApiClientProvider`

- ### provideRegion

  Input: <code style="background-color: #7286D3">region</code> <code style="background-color: #7286D3">shard</code> \
  Output: <code style="background-color: #AC7088">region</code> <code style="background-color: #AC7088">shard</code> \
  Used As: `RemoteApiClientProvider`

- ### provideClientVersionViaVAPI

  Input: <code style="background-color: #65647C">none</code> \
  Output: <code style="background-color: #54BAB9">clientVersion</code> \
  Used As: `RemoteApiClientProvider`

- ### provideClientVersionViaAuthApi

  Input: <code style="background-color: #65647C">none</code> \
  Output: <code style="background-color: #54BAB9">clientVersion</code> \
  Used As: `RemoteApiClientProvider`

- ### provideAuthAutoRegion

  Input: <code style="background-color: #7286D3">username</code> <code style="background-color: #7286D3">password</code> <code style="background-color: #7286D3">mfaCodeProvider(optional)</code>\
  Output: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> <code style="background-color: #AC7088">region</code> <code style="background-color: #AC7088">shard</code> \
  Used As: `RemoteApiClientProvider`
