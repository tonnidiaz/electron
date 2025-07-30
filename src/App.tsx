import { Providers } from "./app/providers";
import HomeView from "./app/home";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
   useEffect(()=>{
    console.log('\nMAIN APP\n');
   },[])
    return (
        <Provider store={store}>
        <Providers>
            <main className="h-full w-full p-4 max-h-full dark:bg-neutral-900">
                <HomeView/>
            </main>
        </Providers>
        </Provider>
    );
};

export default App;
