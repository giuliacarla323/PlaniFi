const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const quoteRoutes = require('./routes/quoteRoutes');
const dailyPlanRoutes = require('./routes/dailyPlanRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const todosRouter = require('./routes/todoRoutes');
const noteRoutes = require('./routes/noteRoutes.js');
const callRoutes = require('./routes/callRoutes');
const budgetRoutes = require('./routes/budget/budgetRoutes');
const  incomeRoutes = require('./routes/budget/incomeRoutes');
const expenseRoutes=require('./routes/budget/expenseRoutes');
const budgetPlanRoutes = require('./routes/budget/budgetPlanRoutes');

//const cron = require('node-cron');
//const sendReminders = require('./services/sendReminders');
const friendRequestRoutes = require('./routes/friends/friendRequestsRoutes');
const friendsRoutes = require('./routes/friends/friendsRoutes');
const userRoutes = require('./routes/friends/userRoutes'); // sau corectează path-ul

const sharedExpenseRoutes = require('./routes/friends/sharedExpenseRoutes');

const groupRoutes = require('./routes/friends/groupRoutes');



app.use('/api/quotes', quoteRoutes);
app.use('/api/dailyplans', dailyPlanRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/todos', todosRouter);
app.use('/api/notes', noteRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget-plans', budgetPlanRoutes);
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shared-expenses', sharedExpenseRoutes);
app.use('/api/groups', groupRoutes);





const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend started at  http://localhost:${PORT}`);
});
