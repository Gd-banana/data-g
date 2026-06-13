import subprocess
import sys
import os

projects = {}

projects['project-1'] = """
import pandas as pd
import numpy as np

np.random.seed(42)
n_users = 1000

df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "性别": np.random.choice(["男", "女", np.nan], size=n_users, p=[0.48, 0.47, 0.05]),
    "地区": np.random.choice(["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", np.nan],
                           size=n_users, p=[0.15, 0.15, 0.12, 0.12, 0.1, 0.1, 0.1, 0.16]),
    "注册时间": pd.date_range(start="2023-01-01", end="2025-04-16", periods=n_users),
    "浏览时长": np.random.exponential(scale=10, size=n_users).round(1)
})

df.loc[np.random.choice(n_users, size=30), "消费金额"] = np.nan
df.loc[np.random.choice(n_users, size=20), "消费频次"] = np.nan
df.loc[np.random.choice(n_users, size=15), "注册时间"] = np.nan
df.loc[np.random.choice(n_users, size=10), "消费金额"] = np.random.uniform(10000, 50000, size=10).round(2)
df.loc[np.random.choice(n_users, size=8), "浏览时长"] = np.random.uniform(100, 500, size=8).round(1)

df_duplicates = df.sample(n=5, random_state=42)
df = pd.concat([df, df_duplicates], ignore_index=True)

print("========== 1. 查看数据基本信息 ==========")
print(df.info())

print("========== 2. 查看前10行数据 ==========")
print(df.head(10))

print("========== 3. 缺失值分析 ==========")
missing_stats = df.isnull().sum()
print("缺失值数量:")
print(missing_stats)

print("========== 4. 处理缺失值 ==========")
df_clean = df.copy()
df_clean['消费金额'] = df_clean['消费金额'].fillna(df_clean['消费金额'].median())
df_clean['消费频次'] = df_clean['消费频次'].fillna(df_clean['消费频次'].median())
df_clean['性别'] = df_clean['性别'].fillna('未知')
df_clean['地区'] = df_clean['地区'].fillna('未知')
df_clean = df_clean.dropna(subset=['注册时间'])
print("处理后缺失值数量:")
print(df_clean.isnull().sum())

print("========== 5. 异常值检测与处理 ==========")
print("消费金额描述统计:")
print(df_clean['消费金额'].describe())

def detect_outliers_iqr(data, column):
    Q1 = data[column].quantile(0.25)
    Q3 = data[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return data[(data[column] < lower_bound) | (data[column] > upper_bound)]

outliers = detect_outliers_iqr(df_clean, '消费金额')
print(f"消费金额异常值数量: {len(outliers)}")
df_clean = df_clean[(df_clean['消费金额'] >= df_clean['消费金额'].quantile(0.01)) &
                   (df_clean['消费金额'] <= df_clean['消费金额'].quantile(0.99))]

print("========== 6. 去除重复值 ==========")
print(f"去重前行数: {len(df_clean)}")
df_clean = df_clean.drop_duplicates()
print(f"去重后行数: {len(df_clean)}")

print("========== 7. 数据类型转换 ==========")
df_clean['注册时间'] = pd.to_datetime(df_clean['注册时间'])
print("处理后数据类型:")
print(df_clean.dtypes)

print("========== 8. 最终数据概览 ==========")
print("数值型字段描述统计:")
print(df_clean.describe().round(2))
"""

projects['project-2'] = """
import pandas as pd
import numpy as np

np.random.seed(42)
n_goods = 500

df = pd.DataFrame({
    "商品ID": [f"G{str(i).zfill(4)}" for i in range(1, n_goods+1)],
    "销量": np.random.poisson(lam=100, size=n_goods),
    "客单价": np.random.lognormal(mean=4, sigma=1, size=n_goods).round(2),
    "好评率": np.random.uniform(0.7, 0.99, size=n_goods).round(2),
    "库存": np.random.randint(10, 1000, size=n_goods)
})

df.loc[np.random.choice(n_goods, size=5), "销量"] = np.random.randint(1000, 5000, size=5)
df.loc[np.random.choice(n_goods, size=3), "好评率"] = 0.999

print("========== 1. 数据概览 ==========")
print(df.info())
print("前5行数据:")
print(df.head())

print("========== 2. 描述统计分析 ==========")
print(df[['销量', '客单价', '好评率', '库存']].describe().round(2))

print("========== 3. 相关性分析 ==========")
corr_matrix = df[['销量', '客单价', '好评率', '库存']].corr()
print("相关系数矩阵:")
print(corr_matrix.round(2))

print("========== 4. 分组分析 ==========")
print("按好评率分组的销量统计:")
rating_groups = df.groupby(pd.cut(df['好评率'], bins=[0.7, 0.8, 0.9, 1.0]))['销量'].agg(['mean', 'count', 'std'])
print(rating_groups)
"""

projects['project-3'] = """
import pandas as pd
import numpy as np

np.random.seed(42)
n_orders = 2000
order_ids = [f"ORD{str(i).zfill(6)}" for i in range(1, n_orders+1)]

products = [
    "手机", "耳机", "充电器", "手机壳", "钢化膜",
    "笔记本电脑", "鼠标", "键盘", "电脑包", "散热器",
    "牛奶", "面包", "鸡蛋", "黄油", "奶酪",
    "洗发水", "护发素", "沐浴露", "牙膏", "牙刷",
    "T恤", "牛仔裤", "运动鞋", "袜子", "帽子"
]

cart_data = []
for order_id in order_ids:
    if np.random.random() < 0.3:
        if np.random.random() < 0.5:
            items = np.random.choice(["手机", "耳机", "充电器", "手机壳", "钢化膜"],
                                   size=np.random.randint(2, 4), replace=False)
        else:
            items = np.random.choice(["牛奶", "面包", "鸡蛋", "黄油"],
                                   size=np.random.randint(2, 4), replace=False)
    else:
        items = np.random.choice(products, size=np.random.randint(1, 6), replace=False)
    for item in items:
        cart_data.append({"订单ID": order_id, "商品名称": item})

df = pd.DataFrame(cart_data)

print("========== 1. 数据概览 ==========")
print(f"订单数: {df['订单ID'].nunique()}")
print(f"商品种类: {df['商品名称'].nunique()}")
print(f"总记录数: {len(df)}")
print("商品销量排行:")
print(df['商品名称'].value_counts().head(10))

print("========== 2. 转换为事务数据 ==========")
transactions = df.groupby('订单ID')['商品名称'].apply(list).tolist()
print(f"事务数量: {len(transactions)}")

print("========== 3. 商品共现矩阵 ==========")
all_products = df['商品名称'].unique()
cooccurrence = pd.DataFrame(0, index=all_products, columns=all_products)
for transaction in transactions:
    for i, item1 in enumerate(transaction):
        for j, item2 in enumerate(transaction):
            if i != j:
                cooccurrence.loc[item1, item2] += 1
print("商品共现矩阵(前5行5列):")
print(cooccurrence.iloc[:5, :5])

print("========== 4. 发现关联规则 ==========")
support_series = df['商品名称'].value_counts() / len(transactions)
rules = []
popular_items = support_series[support_series >= 0.02].index.tolist()[:15]
for item1 in popular_items:
    for item2 in popular_items:
        if item1 != item2:
            both = len([t for t in transactions if item1 in t and item2 in t])
            item1_only = len([t for t in transactions if item1 in t])
            if item1_only > 0:
                confidence = both / item1_only
                support_both = both / len(transactions)
                if confidence > 0.1 and support_both > 0.01:
                    rules.append({'antecedent': item1, 'consequent': item2,
                                  'support': support_both, 'confidence': confidence})
rules_df = pd.DataFrame(rules)
if len(rules_df) > 0:
    rules_df = rules_df.sort_values('confidence', ascending=False)
    print(f"发现的关联规则数量: {len(rules_df)}")
    print(rules_df.head(10).round(4))
else:
    print("没有发现满足条件的关联规则")
"""

projects['project-4'] = """
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n_users = 1000

df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "浏览时长": np.random.exponential(scale=10, size=n_users).round(1)
})

print("========== 1. 数据准备 ==========")
features = df[['消费金额', '消费频次', '最近消费天数', '浏览时长']]
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)
print("标准化完成，特征维度:", scaled_features.shape)

print("========== 2. 确定最佳K值 ==========")
for k in range(2, 8):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(scaled_features)
    print(f"K={k}: inertia={kmeans.inertia_:.2f}")

print("========== 3. 执行 KMeans 聚类 (K=4) ==========")
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['聚类标签'] = kmeans.fit_predict(scaled_features)
print("各聚类用户数量:")
print(df['聚类标签'].value_counts().sort_index())

print("========== 4. 聚类特征分析 ==========")
cluster_analysis = df.groupby('聚类标签')[['消费金额', '消费频次', '最近消费天数', '浏览时长']].mean()
print("各聚类均值:")
print(cluster_analysis.round(2))
"""

projects['project-5'] = """
import pandas as pd
import numpy as np

np.random.seed(42)
n_users = 1000

df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2)
})

df_rfm = df.copy()
print("========== 1. RFM评分 ==========")
df_rfm['R_score'] = pd.qcut(df_rfm['最近消费天数'], q=5, labels=[5, 4, 3, 2, 1])
df_rfm['F_score'] = pd.qcut(df_rfm['消费频次'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5])
df_rfm['M_score'] = pd.qcut(df_rfm['消费金额'], q=5, labels=[1, 2, 3, 4, 5])
df_rfm[['R_score', 'F_score', 'M_score']] = df_rfm[['R_score', 'F_score', 'M_score']].astype(int)
print("RFM评分示例:")
print(df_rfm[['用户ID', 'R_score', 'F_score', 'M_score']].head())

print("========== 2. RFM总分计算 ==========")
df_rfm['RFM_total'] = df_rfm['R_score'] + df_rfm['F_score'] + df_rfm['M_score']
print(f"RFM总分范围: {df_rfm['RFM_total'].min()} - {df_rfm['RFM_total'].max()}")

print("========== 3. 用户分层 ==========")
def get_rfm_level(row):
    if row['R_score'] >= 4 and row['F_score'] >= 4 and row['M_score'] >= 4:
        return '重要价值用户'
    elif row['R_score'] >= 4 and row['F_score'] < 4 and row['M_score'] >= 4:
        return '重要发展用户'
    elif row['R_score'] < 4 and row['F_score'] >= 4 and row['M_score'] >= 4:
        return '重要保持用户'
    elif row['R_score'] < 4 and row['F_score'] < 4 and row['M_score'] >= 4:
        return '重要挽留用户'
    elif row['R_score'] >= 4 and row['F_score'] >= 4 and row['M_score'] < 4:
        return '潜力用户'
    else:
        return '一般用户'

df_rfm['用户层级'] = df_rfm.apply(get_rfm_level, axis=1)
print("各层级用户数量:")
print(df_rfm['用户层级'].value_counts())

print("========== 4. 各层级特征分析 ==========")
level_analysis = df_rfm.groupby('用户层级')[['最近消费天数', '消费频次', '消费金额']].mean()
print("各层级RFM均值:")
print(level_analysis.round(2))
"""

projects['project-6'] = """
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

np.random.seed(42)
dates = pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

advertising = np.random.uniform(100, 1000, size=n_days).round(2)
activities = np.random.randint(0, 5, size=n_days)
price = np.random.uniform(50, 150, size=n_days).round(2)
competitor_price = np.random.uniform(40, 160, size=n_days).round(2)

sales = (100 + 0.5 * advertising + 20 * activities - 0.8 * price + 0.3 * competitor_price + np.random.normal(0, 50, size=n_days)).round(0).astype(int)
sales = np.maximum(sales, 0)

df = pd.DataFrame({
    "日期": dates, "销量": sales, "广告费": advertising,
    "活动次数": activities, "客单价": price, "竞品价格": competitor_price
})

df['月份'] = df['日期'].dt.month
df['星期'] = df['日期'].dt.dayofweek

print("========== 1. 相关性分析 ==========")
print(df[['销量', '广告费', '活动次数', '客单价', '竞品价格']].corr().round(2))

print("========== 2. 划分训练集和测试集 ==========")
X = df[['广告费', '活动次数', '客单价', '竞品价格', '月份', '星期']]
y = df['销量']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"训练集样本数: {len(X_train)}, 测试集样本数: {len(X_test)}")

print("========== 3. 构建线性回归模型 ==========")
model = LinearRegression()
model.fit(X_train, y_train)
print("模型系数:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"  {feature}: {coef:.2f}")
print(f"  截距: {model.intercept_:.2f}")

print("========== 4. 模型评估 ==========")
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)
print(f"训练集 R2: {r2_score(y_train, y_pred_train):.4f}")
print(f"测试集 R2: {r2_score(y_test, y_pred_test):.4f}")
print(f"训练集 RMSE: {np.sqrt(mean_squared_error(y_train, y_pred_train)):.2f}")
print(f"测试集 RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_test)):.2f}")

print("========== 5. 预测示例 ==========")
sample_data = pd.DataFrame({
    '广告费': [500], '活动次数': [2], '客单价': [100],
    '竞品价格': [95], '月份': [6], '星期': [5]
})
prediction = model.predict(sample_data)
print(f"给定条件下预测销量: {prediction[0]:.0f}")
"""

projects['project-7'] = """
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score

np.random.seed(42)
dates = pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

advertising = np.random.uniform(100, 1000, size=n_days).round(2)
activities = np.random.randint(0, 5, size=n_days)
price = np.random.uniform(50, 150, size=n_days).round(2)
competitor_price = np.random.uniform(40, 160, size=n_days).round(2)

sales = (100 + 0.5 * advertising + 20 * activities - 0.8 * price + 0.3 * competitor_price + np.random.normal(0, 50, size=n_days)).round(0).astype(int)
sales = np.maximum(sales, 0)

df = pd.DataFrame({
    "日期": dates, "销量": sales, "广告费": advertising,
    "活动次数": activities, "客单价": price, "竞品价格": competitor_price
})

df['月份'] = df['日期'].dt.month
df['星期'] = df['日期'].dt.dayofweek
df['是否周末'] = (df['星期'] >= 5).astype(int)

print("========== 1. 数据划分 ==========")
X = df[['广告费', '活动次数', '客单价', '竞品价格', '月份', '星期', '是否周末']]
y = df['销量']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("========== 2. 构建随机森林模型 ==========")
rf = RandomForestRegressor(n_estimators=50, random_state=42)
rf.fit(X_train, y_train)

print("========== 3. 模型评估(默认参数) ==========")
y_pred = rf.predict(X_test)
print(f"R2: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")

print("========== 4. 超参数调优 ==========")
param_grid = {'n_estimators': [50, 100], 'max_depth': [None, 10]}
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=1, scoring='r2')
grid_search.fit(X_train, y_train)
print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳交叉验证R2: {grid_search.best_score_:.4f}")

print("========== 5. 使用最佳模型 ==========")
best_rf = grid_search.best_estimator_
y_pred_best = best_rf.predict(X_test)
print(f"调优后R2: {r2_score(y_test, y_pred_best):.4f}")

print("========== 6. 特征重要性分析 ==========")
feature_importance = pd.DataFrame({
    '特征': X.columns, '重要性': best_rf.feature_importances_
}).sort_values('重要性', ascending=False)
print("特征重要性排序:")
print(feature_importance.round(4))
"""

projects['project-8'] = """
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range(start="2023-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

trend = np.linspace(200, 500, n_days)
seasonal = 100 * np.sin(2 * np.pi * (dates.dayofyear / 365)) + 50 * np.sin(2 * np.pi * (dates.dayofyear / 30))

holiday = np.zeros(n_days)
holiday[(dates.month == 6) & (dates.day >= 18) & (dates.day <= 20)] = 200
holiday[(dates.month == 11) & (dates.day >= 10) & (dates.day <= 12)] = 300

noise = np.random.normal(0, 30, n_days)
sales = np.maximum(trend + seasonal + holiday + noise, 0).round(0).astype(int)

df = pd.DataFrame({"日期": dates, "销量": sales})
df.set_index('日期', inplace=True)

print("========== 1. 数据概览 ==========")
print(f"数据时间范围: {df.index.min()} 至 {df.index.max()}")
print(f"总天数: {len(df)}")
print(f"日均销量: {df['销量'].mean():.1f}")

print("========== 2. 最近30天销量 ==========")
print(df.tail(30))

print("========== 3. 月度统计 ==========")
try:
    monthly_stats = df.resample('ME')['销量'].agg(['mean', 'sum', 'std'])
except:
    monthly_stats = df.resample('M')['销量'].agg(['mean', 'sum', 'std'])
print("月度销售统计:")
print(monthly_stats.round(2))

print("========== 4. 周度模式分析 ==========")
df['星期'] = df.index.dayofweek
weekly_pattern = df.groupby('星期')['销量'].mean()
print("星期销量模式(0=周一, 6=周日):")
print(weekly_pattern.round(2))

print("========== 5. 滚动统计分析 ==========")
df['7日移动平均'] = df['销量'].rolling(window=7).mean()
df['30日移动平均'] = df['销量'].rolling(window=30).mean()
print("移动平均示例(最近10天):")
print(df[['销量', '7日移动平均', '30日移动平均']].tail(10).round(2))

print("========== 6. 简单预测 ==========")
last_7d_avg = df['销量'].tail(7).mean()
last_30d_avg = df['销量'].tail(30).mean()
print(f"基于最近7天平均的预测: {last_7d_avg:.0f}")
print(f"基于最近30天平均的预测: {last_30d_avg:.0f}")
"""

projects['project-9'] = """
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n_orders = 5000
order_ids = [f"ORD{str(i).zfill(6)}" for i in range(1, n_orders+1)]
user_ids = [f"U{str(np.random.randint(1, 1001)).zfill(4)}" for _ in range(n_orders)]
order_dates = pd.date_range(start="2024-01-01", end="2024-12-31", periods=n_orders)

df = pd.DataFrame({
    "订单ID": order_ids, "用户ID": user_ids,
    "订单金额": np.random.lognormal(mean=4, sigma=1, size=n_orders).round(2),
    "下单时间": order_dates,
    "支付状态": np.random.choice(["已支付", "未支付", "已取消"], size=n_orders, p=[0.8, 0.15, 0.05]),
    "支付时长": np.random.exponential(scale=2, size=n_orders).round(1)
})

df.loc[df["支付状态"] != "已支付", "支付时长"] = np.nan
df.loc[np.random.choice(n_orders, size=20), "订单金额"] = np.random.uniform(10000, 100000, size=20).round(2)

user_order_counts = df["用户ID"].value_counts().reset_index()
user_order_counts.columns = ["用户ID", "下单频次"]
df = df.merge(user_order_counts, on="用户ID", how="left")
df.loc[np.random.choice(n_orders, size=15), "下单频次"] = np.random.randint(50, 200, size=15)

print("========== 1. 数据概览 ==========")
print(df[['订单金额', '支付时长', '下单频次']].describe().round(2))

print("========== 2. Z-score异常检测 ==========")
def detect_outliers_zscore(data, threshold=3):
    mean = np.mean(data)
    std = np.std(data)
    z_scores = (data - mean) / std
    return np.abs(z_scores) > threshold

df['金额异常_zscore'] = detect_outliers_zscore(df['订单金额'])
print(f"Z-score检测到的金额异常数量: {df['金额异常_zscore'].sum()}")

print("========== 3. IQR方法异常检测 ==========")
def detect_outliers_iqr(data):
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1
    return (data < Q1 - 1.5 * IQR) | (data > Q3 + 1.5 * IQR)

df['金额异常_iqr'] = detect_outliers_iqr(df['订单金额'])
print(f"IQR检测到的金额异常数量: {df['金额异常_iqr'].sum()}")

print("========== 4. Isolation Forest异常检测 ==========")
features = df[['订单金额', '下单频次']].fillna(0)
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)
iso_forest = IsolationForest(contamination=0.01, random_state=42)
df['异常评分'] = iso_forest.fit_predict(scaled_features)
df['iforest异常'] = df['异常评分'] == -1
print(f"Isolation Forest检测到的异常数量: {df['iforest异常'].sum()}")

print("========== 5. 综合异常标记 ==========")
df['综合异常'] = df['金额异常_zscore'] | df['金额异常_iqr'] | df['iforest异常']
print(f"综合检测到的异常数量: {df['综合异常'].sum()}")

print("========== 6. 异常订单详情 ==========")
anomalies = df[df['综合异常']][['订单ID', '订单金额', '支付状态', '下单频次']]
print("异常订单示例:")
print(anomalies.head(10))
"""

projects['project-10'] = """
import pandas as pd
import numpy as np

np.random.seed(42)
n_users = 1000

df_user = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "性别": np.random.choice(["男", "女", np.nan], size=n_users, p=[0.48, 0.47, 0.05]),
    "地区": np.random.choice(["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", np.nan],
                           size=n_users, p=[0.15, 0.15, 0.12, 0.12, 0.1, 0.1, 0.1, 0.16]),
    "注册时间": pd.date_range(start="2023-01-01", end="2025-04-16", periods=n_users),
    "浏览时长": np.random.exponential(scale=10, size=n_users).round(1)
})

df_user.loc[np.random.choice(n_users, size=30), "消费金额"] = np.nan
df_user.loc[np.random.choice(n_users, size=20), "消费频次"] = np.nan
df_user.loc[np.random.choice(n_users, size=15), "注册时间"] = np.nan

print("=" * 60)
print("          数据分析综合实战报告")
print("=" * 60)

print("一、数据概览")
print("-" * 60)
print(f"数据行数: {len(df_user)}")
print(f"数据列数: {len(df_user.columns)}")
print(f"缺失值总数: {df_user.isnull().sum().sum()}")

print("二、数据清洗")
print("-" * 60)
print("缺失值统计:")
print(df_user.isnull().sum())

df_clean = df_user.copy()
df_clean['消费金额'] = df_clean['消费金额'].fillna(df_clean['消费金额'].median())
df_clean['消费频次'] = df_clean['消费频次'].fillna(df_clean['消费频次'].median())
df_clean['性别'] = df_clean['性别'].fillna('未知')
df_clean['地区'] = df_clean['地区'].fillna('未知')
df_clean = df_clean.dropna(subset=['注册时间'])
print(f"清洗后数据行数: {len(df_clean)}")

print("三、描述统计分析")
print("-" * 60)
print(df_clean[['消费金额', '消费频次', '最近消费天数', '浏览时长']].describe().round(2))

print("四、用户画像分析")
print("-" * 60)
print("性别分布:")
print(df_clean['性别'].value_counts())
print("地区分布(前5):")
print(df_clean['地区'].value_counts().head(5))
print("消费金额按性别统计:")
gender_stats = df_clean.groupby('性别')['消费金额'].agg(['mean', 'median', 'count'])
print(gender_stats.round(2))

print("五、RFM用户分层")
print("-" * 60)
df_rfm = df_clean.copy()
df_rfm['R_score'] = pd.qcut(df_rfm['最近消费天数'], q=5, labels=[5, 4, 3, 2, 1])
df_rfm['F_score'] = pd.qcut(df_rfm['消费频次'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5])
df_rfm['M_score'] = pd.qcut(df_rfm['消费金额'], q=5, labels=[1, 2, 3, 4, 5])
df_rfm[['R_score', 'F_score', 'M_score']] = df_rfm[['R_score', 'F_score', 'M_score']].astype(int)

def get_level(row):
    if row['R_score'] >= 4 and row['F_score'] >= 4 and row['M_score'] >= 4:
        return '重要价值用户'
    elif row['M_score'] >= 4:
        return '高消费用户'
    elif row['R_score'] >= 4 and row['F_score'] >= 3:
        return '活跃用户'
    else:
        return '普通用户'

df_rfm['用户层级'] = df_rfm.apply(get_level, axis=1)
print("用户层级分布:")
print(df_rfm['用户层级'].value_counts())

print("六、业务建议")
print("-" * 60)
print("1. 针对重要价值用户: 提供VIP专属服务和个性化推荐")
print("2. 针对高消费用户: 通过优惠活动提高复购率")
print("3. 针对活跃用户: 保持互动，促进消费升级")
print("4. 针对普通用户: 通过运营活动提升活跃度")

print("=" * 60)
print("报告结束")
print("=" * 60)
"""

results = {}
for name, code in projects.items():
    print(f"\n{'='*60}")
    print(f"测试项目: {name}")
    print(f"{'='*60}")
    try:
        exec(code)
        results[name] = "PASS"
        print(f"{name}: PASS")
    except Exception as e:
        results[name] = f"FAIL: {type(e).__name__}: {e}"
        print(f"{name}: FAIL - {type(e).__name__}: {e}")

print(f"\n\n{'='*60}")
print("测试总结")
print(f"{'='*60}")
for name, result in results.items():
    status = "OK" if result == "PASS" else "FAILED"
    print(f"[{status}] {name}: {result}")
