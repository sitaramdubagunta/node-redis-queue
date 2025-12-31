require("dotenv").config();

const redis = require('./redis')

redis.on("connect", () => {
  console.log("Worker connected to Redis");
});



const startworker = async () =>{


    console.log("Worker started. Waiting for jobs...");



    while(true){
        const result = await redis.brpop("job_queue" , 0);


        const jobJson = result[1];
        const job = JSON.parse(jobJson);


        console.log("processing job:" , job);



        await new Promise((resolve)=>setTimeout(resolve , 1000));

        console.log("job done!" , job.id);

    }

}
startworker();