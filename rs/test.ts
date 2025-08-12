import { fetchTodos } from "./lib";

console.log('\n[test.ts]\n')

const main = async () =>{
    const r = await fetchTodos();
    console.log({r})
}

main()