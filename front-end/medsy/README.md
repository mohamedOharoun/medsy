# Instructions

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

## Start the app
In order to start running the project, it is necessary to follow these steps:
1. Go to back-end folder.
```bash
cd .\back-end\
```

2. Start back-end
```
bun start --watch index.ts
```

3. Go to front-end folder.
```bash
cd .\front-end\medsy
```

4. Start front-ed
```bash
npx expo start
```

It is mandatory to change the Windows Network profile to private to avoid the ``--tunnel`` flag and run the app on the mobile phone. Then, we need to change the host IP address in ``api.ts`` for the computer IP (ipconfig for its visualization).


In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

