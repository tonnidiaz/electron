import { exec } from "child_process";
/* 
0724141279
*/
function main(){
    const root = "../../../../../turbo-wp/electron/electron-app/node_modules";
    const args = process.argv.slice(2).map(el=> `${root}/${el}`)

    const cmd=`pnpm add --filter . -D ${args.join(' ')} --offline`
    console.log(`\n$ ${cmd}\n`);
    return;
    const pr = exec(cmd,{cwd: "."}, (err, sout, serr)=>{
        if (err){
            console.error("Failed to exec.", err)
            return
        }
        console.log(sout);
        console.error(serr)
    })
   /*  pr.stdin.on('pipe', msg=>{
        console.log(msg);
    })
    pr.stderr.on('pipe', msg=>{
        console.log(msg);
    }) */
    
}

main()