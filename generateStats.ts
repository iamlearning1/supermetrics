import fs from 'fs';

import moment from 'moment';

import { calculateAverage, calculateCharLength, calculateTotal } from './utils';
import axios from './instance';

const loginInfo = {
    "client_id": "ju16a6m81mhid5ue1z3v2g0uh",
    "email": "your@email.address",
    "name": "Your Name"
};

const fileName = 'stats.json';

fs.unlink(fileName, (err) => console.error(err));

type Post = {
    id: string;
    from_name: string;
    from_id: string;
    message: string;
    type: string;
    created_time: string;    
};

type Obj = { [key: string]: number };

const login = async (): Promise<string> => {
    const { data: tokenData } = await axios({
        url: '/register',
        method: 'POST',
        data: loginInfo,
    })

    return tokenData.data.sl_token;
}

const getPosts = async (sl_token: string): Promise<Post[]> => {
    let run = true;
    let page = 1;
    let posts: Post[] = [];

    while (run) {
        const { data: postsData } = await axios({
            url: '/posts',
            method: 'GET',
            params: {
                sl_token,
                page
            }
        })

        run = page === postsData.data.page;
       
        if (run) posts = [...posts, ...postsData.data.posts];

        page += 1;
    }

    return posts;
}

(async () => {
    try {
        const sl_token = await login();

        const posts = await getPosts(sl_token);

        const avg: { [key: string]: { chars: number, count: number } } = {};
        const lengths: Obj = {};
        const totalPostsByWeek: Obj = {};
        const avgPostsPerUserPerMonth: Obj = {};
        const averages: Obj = {};

        for (const post of posts) {
            const month = moment(post.created_time).format('MMM');
            const week = moment(post.created_time).week();
            
            calculateAverage(avg, month, post.message.length)

            calculateCharLength(lengths, month, post.message.length);

            // calculate total posts by week
            calculateTotal(totalPostsByWeek, week.toString());

            // avg posts user/month
            calculateTotal(avgPostsPerUserPerMonth, post.from_id);
        }

        for (const key in avg) {
            const item = avg[key];

            averages[key] = Number((item.chars / item.count).toFixed(2));
        }

        fs.writeFileSync(fileName, JSON.stringify({
            averageNumberOfCharactersByMonth: averages,
            longestPostByCharacterLengthPerMonth: lengths,
            totalPostsByWeek,
            averageNumberOfPostsPerUserPerMonth: avgPostsPerUserPerMonth,
        }));

        console.log(`File ${fileName} created`);
    } catch (error) {
        console.error(error);
    }
})();