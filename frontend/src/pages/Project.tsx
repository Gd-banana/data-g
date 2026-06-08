import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

let initPyodide: () => Promise<any>;

async function loadPyodideModule() {
  const module = await import('../utils/pyodide');
  initPyodide = module.initPyodide;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface ProjectProps {
  user: User | null;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  coreSkills: string[];
  businessScenario: string;
  tasks: string[];
  dataParams: {
    name: string;
    label: string;
    type: 'number' | 'range';
    default: number;
    min?: number;
    max?: number;
  }[];
  defaultCode: string;
  referenceCode: string;
  pitfalls: string[];
  teachingContent?: {
    title: string;
    sections: {
      heading: string;
      content: string;
      code?: string;
    }[];
  };
}

const projectsData: Record<string, ProjectData> = {
  'project-1': {
    id: 'project-1',
    title: '数据预处理高阶版',
    description: '学习数据清洗、缺失值处理、异常值检测和数据转换的高级技巧',
    coreSkills: ['Pandas数据清洗', '缺失值处理', '异常值检测', '数据转换', '重复值处理'],
    businessScenario: '电商平台用户行为数据分析场景。需要对用户行为数据进行清洗和预处理，为后续的用户画像分析和精准营销做准备。',
    tasks: [
      '加载用户行为数据集',
      '检测并处理缺失值',
      '识别并处理异常值',
      '去除重复数据',
      '数据类型转换和格式标准化',
      '生成清洗后的数据集报告'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 },
      { name: 'n_users', label: '用户数量', type: 'range', default: 1000, min: 100, max: 5000 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

# ============ 练习任务 ============
# 1. 加载并查看数据基本信息
# 2. 检测缺失值并处理
# 3. 识别异常值并处理
# 4. 去除重复数据
# 5. 数据类型转换

# 生成用户行为数据
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

# 添加脏数据
df.loc[np.random.choice(n_users, size=30), "消费金额"] = np.nan
df.loc[np.random.choice(n_users, size=20), "消费频次"] = np.nan
df.loc[np.random.choice(n_users, size=15), "注册时间"] = np.nan

# 添加重复值
df_duplicates = df.sample(n=5, random_state=42)
df = pd.concat([df, df_duplicates], ignore_index=True)

# ============ 请在下方编写你的代码 ============

# 1. 查看数据基本信息


# 2. 检测缺失值


# 3. 处理缺失值（提示：数值型字段用中位数填充，类别型字段用'未知'填充）


# 4. 检测并处理异常值（提示：使用IQR方法）


# 5. 去除重复值


# 6. 数据类型转换（将注册时间转为datetime）


# 7. 输出最终结果
df.head()`,
    referenceCode: `import pandas as pd
import numpy as np

# 生成用户行为数据
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

# 添加一些脏数据
df.loc[np.random.choice(n_users, size=30), "消费金额"] = np.nan
df.loc[np.random.choice(n_users, size=20), "消费频次"] = np.nan
df.loc[np.random.choice(n_users, size=15), "注册时间"] = np.nan
df.loc[np.random.choice(n_users, size=10), "消费金额"] = np.random.uniform(10000, 50000, size=10).round(2)
df.loc[np.random.choice(n_users, size=8), "浏览时长"] = np.random.uniform(100, 500, size=8).round(1)

# 添加重复值
df_duplicates = df.sample(n=5, random_state=42)
df = pd.concat([df, df_duplicates], ignore_index=True)

print("========== 1. 查看数据基本信息 ==========")
print(df.info())

print("\\n========== 2. 查看前10行数据 ==========")
print(df.head(10))

print("\\n========== 3. 缺失值分析 ==========")
missing_stats = df.isnull().sum()
print("缺失值数量:")
print(missing_stats)
print(f"\\n缺失值占比(>0的列):")
print((missing_stats[missing_stats > 0] / len(df) * 100).round(2))

print("\\n========== 4. 处理缺失值 ==========")
df_clean = df.copy()
df_clean['消费金额'] = df_clean['消费金额'].fillna(df_clean['消费金额'].median())
df_clean['消费频次'] = df_clean['消费频次'].fillna(df_clean['消费频次'].median())
df_clean['性别'] = df_clean['性别'].fillna('未知')
df_clean['地区'] = df_clean['地区'].fillna('未知')
df_clean = df_clean.dropna(subset=['注册时间'])
print("处理后缺失值数量:")
print(df_clean.isnull().sum())

print("\\n========== 5. 异常值检测与处理 ==========")
print("消费金额描述统计:")
print(df_clean['消费金额'].describe())

# 使用IQR方法检测异常值
def detect_outliers_iqr(data, column):
    Q1 = data[column].quantile(0.25)
    Q3 = data[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return data[(data[column] < lower_bound) | (data[column] > upper_bound)]

outliers = detect_outliers_iqr(df_clean, '消费金额')
print(f"\\n消费金额异常值数量: {len(outliers)}")
df_clean = df_clean[(df_clean['消费金额'] >= df_clean['消费金额'].quantile(0.01)) & 
                   (df_clean['消费金额'] <= df_clean['消费金额'].quantile(0.99))]

print("\\n========== 6. 去除重复值 ==========")
print(f"去重前行数: {len(df_clean)}")
df_clean = df_clean.drop_duplicates()
print(f"去重后行数: {len(df_clean)}")

print("\\n========== 7. 数据类型转换 ==========")
df_clean['注册时间'] = pd.to_datetime(df_clean['注册时间'])
print("处理后数据类型:")
print(df_clean.dtypes)

print("\\n========== 8. 最终数据概览 ==========")
print("数值型字段描述统计:")
print(df_clean.describe().round(2))
print("\\n非数值型字段描述统计:")
print(df_clean.describe(include=['object', 'datetime64']).round(2))`,
    pitfalls: [
      '直接使用dropna()删除所有含缺失值的行，导致数据量大幅减少',
      '忽视异常值的存在，直接进行后续分析',
      '忘记处理重复数据，导致分析结果偏差',
      '日期字段没有转换为datetime类型就进行时间分析',
      '填充缺失值时使用均值填充偏态分布的数据'
    ],
    teachingContent: {
      title: '数据预处理核心知识',
      sections: [
        {
          heading: '1. 为什么数据预处理如此重要',
          content: '数据预处理是数据分析的第一步，也是最关键的一步。高质量的数据才能产出可靠的分析结果。实际业务数据往往存在各种问题：缺失值、异常值、重复数据、格式不一致等。'
        },
        {
          heading: '2. 缺失值处理方法',
          content: '缺失值是数据中常见的问题，处理方法有多种：\n\n1) 删除法：df.dropna() - 适合缺失比例小的情况\n2) 填充法：df.fillna() - 使用均值、中位数、众数或特定值填充\n3) 插值法：df.interpolate() - 适合时间序列数据\n\n选择哪种方法取决于字段类型和业务场景。'
        },
        {
          heading: '3. 如何检测缺失值',
          content: '使用Pandas可以快速检测缺失值：',
          code: '# 统计每列缺失值数量\nmissing = df.isnull().sum()\n\n# 查看缺失值占比\nmissing_ratio = (missing / len(df)) * 100\n\n# 只显示有缺失值的列\nprint(missing[missing > 0])'
        },
        {
          heading: '4. 异常值检测方法',
          content: '异常值会严重影响分析结果，常见检测方法：\n\n1) 统计方法：IQR（四分位距）方法\n2) 统计描述：describe()查看数据分布\n3) 可视化：箱线图、直方图\n\nIQR方法：异常值 = 小于Q1-1.5*IQR 或 大于Q3+1.5*IQR'
        },
        {
          heading: '5. 使用IQR检测异常值',
          content: 'IQR是检测异常值最常用的方法之一：',
          code: 'def detect_outliers(data, column):\n    Q1 = data[column].quantile(0.25)\n    Q3 = data[column].quantile(0.75)\n    IQR = Q3 - Q1\n    lower_bound = Q1 - 1.5 * IQR\n    upper_bound = Q3 + 1.5 * IQR\n    return data[(data[column] < lower_bound) | (data[column] > upper_bound)]\n\noutliers = detect_outliers(df, \'消费金额\')\nprint(f"异常值数量: {len(outliers)}")'
        },
        {
          heading: '6. 重复值处理',
          content: '重复数据会导致分析结果失真，必须处理：',
          code: '# 检查重复值数量\nduplicate_count = df.duplicated().sum()\nprint(f"重复行数: {duplicate_count}")\n\n# 删除重复值\ndf_clean = df.drop_duplicates()\nprint(f"去重后行数: {len(df_clean)}")'
        },
        {
          heading: '7. 数据类型转换',
          content: '确保字段使用正确的数据类型：\n\n1) 日期字段：pd.to_datetime()\n2) 数值字段：pd.to_numeric()\n3) 类别字段：astype(\'category\')',
          code: '# 将字符串转换为日期\ndf[\'注册时间\'] = pd.to_datetime(df[\'注册时间\'])\n\n# 查看数据类型\nprint(df.dtypes)'
        },
        {
          heading: '8. 完整预处理流程总结',
          content: '一个完整的数据预处理流程通常包括：\n\n1. 数据加载和初步查看\n2. 缺失值检测和处理\n3. 异常值检测和处理\n4. 重复值检测和处理\n5. 数据类型转换\n6. 数据标准化/归一化（可选）\n7. 生成处理报告'
        }
      ]
    }
  },
  'project-2': {
    id: 'project-2',
    title: '探索性数据分析(EDA)',
    description: '掌握EDA方法论，通过可视化和统计分析发现数据规律',
    coreSkills: ['数据可视化', '统计分析', 'Matplotlib', 'Seaborn', '相关性分析'],
    businessScenario: '电商平台商品销售数据分析场景。需要对商品销售数据进行探索性分析，发现销售规律和潜在问题。',
    tasks: [
      '加载商品销售数据集',
      '数据概览和基本统计分析',
      '单变量分布分析',
      '多变量相关性分析',
      '可视化展示关键发现',
      '生成EDA报告'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 },
      { name: 'n_goods', label: '商品数量', type: 'range', default: 500, min: 100, max: 1000 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

# ============ 练习任务 ============
# 1. 数据概览和基本统计分析
# 2. 单变量分布分析
# 3. 多变量相关性分析
# 4. 关键发现总结

# 生成商品销售数据
np.random.seed(42)
n_goods = 500

df = pd.DataFrame({
    "商品ID": [f"G{str(i).zfill(4)}" for i in range(1, n_goods+1)],
    "销量": np.random.poisson(lam=100, size=n_goods),
    "客单价": np.random.lognormal(mean=4, sigma=1, size=n_goods).round(2),
    "好评率": np.random.uniform(0.7, 0.99, size=n_goods).round(2),
    "库存": np.random.randint(10, 1000, size=n_goods)
})

# 添加异常数据
df.loc[np.random.choice(n_goods, size=5), "销量"] = np.random.randint(1000, 5000, size=5)
df.loc[np.random.choice(n_goods, size=3), "好评率"] = 0.999

# ============ 请在下方编写你的代码 ============

# 1. 查看数据基本信息


# 2. 查看描述统计


# 3. 计算相关性矩阵


# 4. 分析销量与好评率的关系


# 5. 输出关键发现`,
    referenceCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

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
print("\\n前5行数据:")
print(df.head())

print("\\n========== 2. 描述统计分析 ==========")
print("数值型字段描述统计:")
print(df[['销量', '客单价', '好评率', '库存']].describe().round(2))

print("\\n========== 3. 相关性分析 ==========")
corr_matrix = df[['销量', '客单价', '好评率', '库存']].corr()
print("相关系数矩阵:")
print(corr_matrix.round(2))

print("\\n========== 4. 单变量分析 ==========")
print("\\n销量分布:")
print(df['销量'].value_counts(bins=10))

print("\\n好评率分布:")
print(df['好评率'].describe())

print("\\n========== 5. 多变量分析 ==========")
print("\\n按好评率分组的销量统计:")
rating_groups = df.groupby(pd.cut(df['好评率'], bins=[0.7, 0.8, 0.9, 1.0]))['销量'].agg(['mean', 'count', 'std'])
print(rating_groups)`,
    pitfalls: [
      '只做单一图表，没有从多个角度分析数据',
      '忽视数据分布特征，直接进行假设检验',
      '没有检查变量之间的相关性',
      '图表过于复杂，难以解读',
      '没有对异常值进行标注和分析'
    ],
    teachingContent: {
      title: '探索性数据分析核心知识',
      sections: [
        {
          heading: '1. 什么是EDA',
          content: '探索性数据分析（Exploratory Data Analysis, EDA）是数据分析的第一步。它的目的是：\n\n1) 理解数据的基本结构\n2) 发现数据中的模式和规律\n3) 识别数据质量问题\n4) 提出进一步分析的假设\n5) 为后续建模做准备'
        },
        {
          heading: '2. EDA的主要步骤',
          content: 'EDA通常包含以下步骤：\n\n1) 数据概览（数据类型、维度、基本统计）\n2) 缺失值分析\n3) 单变量分析（分布、统计量）\n4) 多变量分析（相关性、交叉分析）\n5) 可视化探索\n6) 异常值检测'
        },
        {
          heading: '3. 数据概览',
          content: '首先了解数据的基本情况：',
          code: 'import pandas as pd\nimport numpy as np\n\n# 查看数据基本信息\nprint(df.info())\n\n# 查看前几行数据\nprint(df.head())\n\n# 描述统计\nprint(df.describe())\n\n# 查看数据形状\nprint(f"数据形状: {df.shape}")\nprint(f"列数: {len(df.columns)}")'
        },
        {
          heading: '4. 缺失值分析',
          content: '缺失值是数据中常见的问题：',
          code: '# 统计缺失值数量\nmissing_stats = df.isnull().sum()\nprint("缺失值数量:")\nprint(missing_stats)\n\n# 只显示有缺失值的列\nprint("\\n有缺失值的列:")\nprint(missing_stats[missing_stats > 0])\n\n# 缺失值占比\nmissing_ratio = (missing_stats / len(df)) * 100\nprint("\\n缺失值占比:")\nprint(missing_ratio[missing_ratio > 0].round(2))'
        },
        {
          heading: '5. 单变量分析',
          content: '分析单个变量的分布特征：',
          code: '# 数值型变量分析\nprint("销量描述统计:")\nprint(df[\'销量\'].describe())\n\n# 分类变量分析\nprint("\\n地区分布:")\nprint(df[\'地区\'].value_counts())\n\n# 频率分布\nprint("\\n销量频率分布:")\nprint(df[\'销量\'].value_counts(bins=10))'
        },
        {
          heading: '6. 相关性分析',
          content: '分析变量之间的关系：',
          code: '# 计算相关系数矩阵\ncorr_matrix = df[[\'销量\', \'客单价\', \'好评率\', \'库存\']].corr()\nprint("相关系数矩阵:")\nprint(corr_matrix.round(2))\n\n# 散点图分析（文字描述）\nprint("\\n相关性解读:")\nprint("- 销量与客单价的相关系数: {:.2f}".format(corr_matrix.loc[\'销量\', \'客单价\']))\nprint("- 销量与好评率的相关系数: {:.2f}".format(corr_matrix.loc[\'销量\', \'好评率\']))'
        },
        {
          heading: '7. 分组分析',
          content: '按类别分组分析：',
          code: '# 按好评率分组分析\nrating_groups = df.groupby(pd.cut(df[\'好评率\'], bins=[0.7, 0.8, 0.9, 1.0]))\n\n# 计算各组统计量\ngroup_stats = rating_groups[\'销量\'].agg([\'mean\', \'count\', \'std\'])\nprint("按好评率分组的销量统计:")\nprint(group_stats.round(2))\n\n# 交叉表分析\nprint("\\n性别与购买频次交叉分析:")\ncross_tab = pd.crosstab(df[\'性别\'], df[\'消费频次\'])'
        },
        {
          heading: '8. EDA可视化技巧',
          content: '可视化是EDA的重要工具：\n\n1) 直方图：展示数值分布\n2) 箱线图：展示数据分布和异常值\n3) 散点图：展示变量关系\n4) 柱状图：展示分类数据\n5) 热力图：展示相关性矩阵\n\n好的可视化应该简洁、清晰、有信息量。'
        }
      ]
    }
  },
  'project-3': {
    id: 'project-3',
    title: '购物车关联规则挖掘',
    description: '使用Apriori算法挖掘商品之间的关联关系',
    coreSkills: ['关联规则', 'Apriori算法', 'mlxtend', '支持度', '置信度', '提升度'],
    businessScenario: '电商平台购物车分析场景。需要挖掘用户购物车中商品之间的关联关系，为商品推荐和促销活动提供依据。',
    tasks: [
      '加载购物车数据集',
      '数据格式转换（事务数据）',
      '使用Apriori算法挖掘关联规则',
      '分析支持度、置信度、提升度',
      '筛选有意义的关联规则',
      '可视化展示关联规则'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 },
      { name: 'n_orders', label: '订单数量', type: 'range', default: 2000, min: 500, max: 5000 }
    ],
    defaultCode: `import pandas as pd
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
    items = np.random.choice(products, size=np.random.randint(1, 6), replace=False)
    for item in items:
        cart_data.append({"订单ID": order_id, "商品名称": item})

df = pd.DataFrame(cart_data)
print("购物车数据前10行:")
print(df.head(10))
print(f"\\n总订单数: {df['订单ID'].nunique()}")
print(f"商品种类数: {df['商品名称'].nunique()}")`,
    referenceCode: `import pandas as pd
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

print("\\n商品销量排行:")
print(df['商品名称'].value_counts().head(10))

print("\\n========== 2. 转换为事务数据 ==========")
transactions = df.groupby('订单ID')['商品名称'].apply(list).tolist()
print(f"事务数量: {len(transactions)}")
print(f"前3个事务示例:")
for i in range(min(3, len(transactions))):
    print(f"  {i+1}. {transactions[i]}")

print("\\n========== 3. 计算商品共现矩阵 ==========")
all_products = df['商品名称'].unique()
cooccurrence = pd.DataFrame(0, index=all_products, columns=all_products)

for transaction in transactions:
    for i, item1 in enumerate(transaction):
        for j, item2 in enumerate(transaction):
            if i != j:
                cooccurrence.loc[item1, item2] += 1

print("商品共现矩阵(前5行5列):")
print(cooccurrence.iloc[:5, :5])

print("\\n========== 4. 计算支持度和置信度 ==========")
support = df['商品名称'].value_counts() / len(transactions)

print("\\n商品支持度排行(前10):")
print(support.sort_values(ascending=False).head(10).round(4))

print("\\n========== 5. 分析强关联商品对 ==========")
min_support = 0.02
popular_items = support[support >= min_support].index.tolist()

print(f"\\n支持度 >= {min_support} 的商品数量: {len(popular_items)}")
print("这些商品是:", popular_items)

print("\\n========== 6. 发现关联规则 ==========")
rules = []
for item1 in popular_items:
    for item2 in popular_items:
        if item1 != item2:
            both = len([t for t in transactions if item1 in t and item2 in t])
            item1_only = len([t for t in transactions if item1 in t])
            
            if item1_only > 0:
                confidence = both / item1_only
                support_both = both / len(transactions)
                
                if confidence > 0.1 and support_both > 0.01:
                    rules.append({
                        'antecedent': item1,
                        'consequent': item2,
                        'support': support_both,
                        'confidence': confidence
                    })

rules_df = pd.DataFrame(rules)
rules_df = rules_df.sort_values('confidence', ascending=False)

print(f"\\n发现的关联规则数量: {len(rules_df)}")
print("\\n强关联规则(置信度降序):")
print(rules_df.head(10).round(4))`,
    pitfalls: [
      '支持度阈值设置过高，导致无法发现有意义的规则',
      '只关注置信度，忽略提升度指标',
      '没有考虑规则的实际业务意义',
      '对大规模数据集直接使用Apriori导致性能问题',
      '没有处理稀疏数据问题'
    ],
    teachingContent: {
      title: '关联规则挖掘核心知识',
      sections: [
        {
          heading: '1. 什么是关联规则',
          content: '关联规则挖掘是数据挖掘的重要技术，用于发现数据集中项目之间的关联关系。最经典的应用场景是购物篮分析，发现顾客购买商品之间的关联。\n\n例如："购买牛奶的顾客有80%也会购买面包"。'
        },
        {
          heading: '2. 关联规则的核心概念',
          content: '关联规则有三个核心指标：\n\n1) 支持度(Support)：项集在数据集中出现的频率\n   Support(X) = 包含X的事务数 / 总事务数\n\n2) 置信度(Confidence)：在购买X的情况下购买Y的概率\n   Confidence(X→Y) = Support(X∪Y) / Support(X)\n\n3) 提升度(Lift)：购买X对购买Y的提升效果\n   Lift(X→Y) = Confidence(X→Y) / Support(Y)'
        },
        {
          heading: '3. Apriori算法原理',
          content: 'Apriori算法是最经典的关联规则挖掘算法：\n\n1) 生成所有可能的项集\n2) 筛选出支持度大于最小阈值的项集（频繁项集）\n3) 从频繁项集中生成关联规则\n4) 筛选出置信度和提升度满足条件的规则\n\nApriori原理：如果一个项集是频繁的，那么它的所有子集也是频繁的。',
          code: '# Apriori算法伪代码\n# 1. 生成1项频繁项集\n# 2. 循环：\n#    从k项频繁项集生成k+1项候选集\n#    剪枝：去除包含非频繁子集的候选集\n#    计算支持度，筛选频繁项集\n# 3. 生成关联规则'
        },
        {
          heading: '4. 数据格式转换',
          content: '关联规则挖掘需要事务格式的数据：',
          code: '# 将购物车数据转换为事务格式\n# 原始格式：每行是一个订单中的一个商品\n# 转换后：每行是一个订单的所有商品列表\n\n# 示例代码\ntransactions = df.groupby(\'订单ID\')[\'商品名称\'].apply(list).tolist()\n\nprint(f"事务数量: {len(transactions)}")\nprint(f"前3个事务示例:")\nfor i in range(min(3, len(transactions))):\n    print(f"  {i+1}. {transactions[i]}")'
        },
        {
          heading: '5. 商品共现分析',
          content: '分析商品之间的共现关系：',
          code: '# 创建商品共现矩阵\nall_products = df[\'商品名称\'].unique()\ncooccurrence = pd.DataFrame(0, index=all_products, columns=all_products)\n\nfor transaction in transactions:\n    for i, item1 in enumerate(transaction):\n        for j, item2 in enumerate(transaction):\n            if i != j:\n                cooccurrence.loc[item1, item2] += 1\n\nprint("商品共现矩阵(前5行5列):")\nprint(cooccurrence.iloc[:5, :5])'
        },
        {
          heading: '6. 支持度计算',
          content: '计算商品的支持度：',
          code: '# 计算支持度\nsupport = df[\'商品名称\'].value_counts() / len(transactions)\n\nprint("商品支持度排行(前10):")\nprint(support.sort_values(ascending=False).head(10).round(4))\n\n# 设置最小支持度阈值\nmin_support = 0.02\npopular_items = support[support >= min_support].index.tolist()\nprint(f"\\n支持度 >= {min_support} 的商品数量: {len(popular_items)}")'
        },
        {
          heading: '7. 发现强关联规则',
          content: '发现有意义的关联规则：',
          code: '# 简单的关联规则发现\nrules = []\nfor item1 in popular_items:\n    for item2 in popular_items:\n        if item1 != item2:\n            # 同时购买item1和item2的事务数\n            both = len([t for t in transactions if item1 in t and item2 in t])\n            # 购买item1的事务数\n            item1_only = len([t for t in transactions if item1 in t])\n            \n            if item1_only > 0:\n                confidence = both / item1_only\n                support_both = both / len(transactions)\n                \n                if confidence > 0.1 and support_both > 0.01:\n                    rules.append({\n                        \'antecedent\': item1,\n                        \'consequent\': item2,\n                        \'support\': support_both,\n                        \'confidence\': confidence\n                    })\n\nrules_df = pd.DataFrame(rules).sort_values(\'confidence\', ascending=False)\nprint(f"发现的关联规则数量: {len(rules_df)}")'
        },
        {
          heading: '8. 业务应用场景',
          content: '关联规则的应用场景：\n\n1) 购物篮分析：商品推荐、捆绑销售\n2) 网页推荐：页面关联分析\n3) 医疗诊断：症状与疾病关联\n4) 欺诈检测：异常行为模式\n\n在业务决策中，提升度大于1的规则才具有实际意义。'
        }
      ]
    }
  },
  'project-4': {
    id: 'project-4',
    title: 'KMeans聚类分析实战',
    description: '使用KMeans算法进行客户分群和市场细分',
    coreSkills: ['KMeans聚类', 'scikit-learn', '特征工程', '聚类评估', '可视化'],
    businessScenario: '电商平台客户细分场景。需要根据用户行为数据进行客户分群，为精准营销提供支持。',
    tasks: [
      '加载用户行为数据集',
      '数据预处理和特征选择',
      '使用KMeans进行聚类',
      '确定最佳聚类数(K值)',
      '分析各聚类特征',
      '可视化聚类结果'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 },
      { name: 'n_users', label: '用户数量', type: 'range', default: 1000, min: 200, max: 3000 }
    ],
    defaultCode: `import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

np.random.seed(42)
n_users = 1000

df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "浏览时长": np.random.exponential(scale=10, size=n_users).round(1)
})

print("用户数据前5行:")
print(df.head())
print("\\n数据描述统计:")
print(df.describe())`,
    referenceCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
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

print("\\n========== 2. 确定最佳K值(肘部法则) ==========")
inertia = []
k_range = range(2, 10)

for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(scaled_features)
    inertia.append(kmeans.inertia_)

print("K值对应的惯性值:")
for k, val in zip(k_range, inertia):
    print(f"K={k}: {val:.2f}")

print("\\n========== 3. 执行KMeans聚类 ==========")
kmeans = KMeans(n_clusters=4, random_state=42)
df['聚类标签'] = kmeans.fit_predict(scaled_features)

print("\\n各聚类数量分布:")
print(df['聚类标签'].value_counts())

print("\\n========== 4. 分析聚类特征 ==========")
cluster_analysis = df.groupby('聚类标签')[['消费金额', '消费频次', '最近消费天数', '浏览时长']].mean()
print("各聚类均值:")
print(cluster_analysis.round(2))

print("\\n========== 5. 聚类命名建议 ==========")
cluster_names = {}
for cluster in range(4):
    row = cluster_analysis.loc[cluster]
    if row['消费金额'] > 300 and row['消费频次'] > 8:
        cluster_names[cluster] = '高价值活跃用户'
    elif row['消费金额'] > 200 and row['最近消费天数'] < 30:
        cluster_names[cluster] = '潜力用户'
    elif row['消费频次'] < 2:
        cluster_names[cluster] = '沉睡用户'
    else:
        cluster_names[cluster] = '普通用户'

print(cluster_names)`,
    pitfalls: [
      '没有对数据进行标准化就进行聚类',
      '随意选择K值，没有使用肘部法则或轮廓系数',
      '忽略异常值对聚类结果的影响',
      '只关注聚类结果，不分析每个簇的特征',
      '特征选择不当，包含无关或冗余特征'
    ],
    teachingContent: {
      title: 'KMeans聚类分析核心知识',
      sections: [
        {
          heading: '1. 什么是聚类分析',
          content: '聚类分析是一种无监督学习方法，用于将数据集中的样本分成若干个组（簇），使得同一簇内的样本相似度尽可能高，不同簇之间的相似度尽可能低。\n\n常见应用场景：客户分群、市场细分、图像分割、异常检测等。'
        },
        {
          heading: '2. KMeans算法原理',
          content: 'KMeans是最常用的聚类算法之一：\n\n1) 随机选择K个初始质心\n2) 计算每个样本到各个质心的距离\n3) 将样本分配到距离最近的质心所在的簇\n4) 更新每个簇的质心（计算簇内所有样本的均值）\n5) 重复步骤2-4，直到质心不再变化或达到最大迭代次数'
        },
        {
          heading: '3. 数据标准化',
          content: 'KMeans对特征的尺度非常敏感，必须先标准化：',
          code: 'from sklearn.preprocessing import StandardScaler\n\n# 选择特征\nfeatures = df[[\'消费金额\', \'消费频次\', \'最近消费天数\', \'浏览时长\']]\n\n# 标准化数据\nscaler = StandardScaler()\nscaled_features = scaler.fit_transform(features)\n\nprint("标准化后数据的均值:", scaled_features.mean(axis=0).round(2))\nprint("标准化后数据的标准差:", scaled_features.std(axis=0).round(2))'
        },
        {
          heading: '4. 确定最佳K值-肘部法则',
          content: '肘部法则是确定K值的常用方法：',
          code: '# 使用肘部法则确定最佳K值\ninertia = []\nk_range = range(2, 10)\n\nfor k in k_range:\n    kmeans = KMeans(n_clusters=k, random_state=42)\n    kmeans.fit(scaled_features)\n    inertia.append(kmeans.inertia_)  # 簇内平方和\n\nprint("K值对应的惯性值:")\nfor k, val in zip(k_range, inertia):\n    print(f"K={k}: {val:.2f}")\n\n# 肘部点：惯性值下降速度明显减缓的点'
        },
        {
          heading: '5. 执行KMeans聚类',
          content: '使用KMeans进行聚类：',
          code: 'from sklearn.cluster import KMeans\n\n# 创建并训练KMeans模型\nkmeans = KMeans(n_clusters=4, random_state=42)\ndf[\'聚类标签\'] = kmeans.fit_predict(scaled_features)\n\n# 查看各聚类数量分布\nprint("各聚类数量分布:")\nprint(df[\'聚类标签\'].value_counts())'
        },
        {
          heading: '6. 分析聚类特征',
          content: '分析每个簇的特征：',
          code: '# 分析各聚类特征\ncluster_analysis = df.groupby(\'聚类标签\')[[\n    \'消费金额\', \'消费频次\', \'最近消费天数\', \'浏览时长\'\n]].mean()\n\nprint("各聚类均值:")\nprint(cluster_analysis.round(2))'
        },
        {
          heading: '7. 聚类命名',
          content: '根据聚类特征为每个簇命名：',
          code: '# 为聚类命名\ncluster_names = {}\nfor cluster in range(4):\n    row = cluster_analysis.loc[cluster]\n    if row[\'消费金额\'] > 300 and row[\'消费频次\'] > 8:\n        cluster_names[cluster] = \'高价值活跃用户\'\n    elif row[\'消费金额\'] > 200 and row[\'最近消费天数\'] < 30:\n        cluster_names[cluster] = \'潜力用户\'\n    elif row[\'消费频次\'] < 2:\n        cluster_names[cluster] = \'沉睡用户\'\n    else:\n        cluster_names[cluster] = \'普通用户\'\n\nprint(cluster_names)'
        },
        {
          heading: '8. 聚类评估方法',
          content: '评估聚类效果的方法：\n\n1) 惯性值(Inertia)：簇内样本到质心的距离平方和，越小越好\n2) 轮廓系数(Silhouette Score)：衡量样本与同簇样本的相似度和与其他簇样本的差异，范围[-1,1]\n3) Calinski-Harabasz指数：类间方差与类内方差的比值，越大越好\n\n选择K值时，综合考虑肘部法则和轮廓系数。'
        }
      ]
    }
  },
  'project-5': {
    id: 'project-5',
    title: 'RFM模型用户分层',
    description: '基于RFM模型对用户进行价值分层和精细化运营',
    coreSkills: ['RFM模型', '用户价值分析', '用户分层', 'Pandas', '分位数分析'],
    businessScenario: '电商平台用户价值评估场景。需要使用RFM模型对用户进行价值分层，为精细化运营提供依据。',
    tasks: [
      '加载用户交易数据集',
      '计算RFM指标',
      'RFM评分和分层',
      '分析各层级用户特征',
      '制定差异化运营策略',
      '输出用户分层报告'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 },
      { name: 'n_users', label: '用户数量', type: 'range', default: 1000, min: 200, max: 3000 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n_users = 1000

df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2)
})

print("RFM数据前5行:")
print(df.head())`,
    referenceCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n_users = 1000

df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "最近消费天数": np.random.randint(1, 366, size=n_users),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2)
})

print("========== 1. RFM指标计算 ==========")
df_rfm = df.copy()

print("\\n========== 2. RFM评分(1-5分) ==========")
# R(最近消费天数)：越小越好，所以反转
df_rfm['R_score'] = pd.qcut(df_rfm['最近消费天数'], q=5, labels=[5, 4, 3, 2, 1])
# F(消费频次)：越大越好
df_rfm['F_score'] = pd.qcut(df_rfm['消费频次'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5])
# M(消费金额)：越大越好
df_rfm['M_score'] = pd.qcut(df_rfm['消费金额'], q=5, labels=[1, 2, 3, 4, 5])

df_rfm[['R_score', 'F_score', 'M_score']] = df_rfm[['R_score', 'F_score', 'M_score']].astype(int)

print("RFM评分示例:")
print(df_rfm[['用户ID', 'R_score', 'F_score', 'M_score']].head())

print("\\n========== 3. RFM总分计算 ==========")
df_rfm['RFM_total'] = df_rfm['R_score'] + df_rfm['F_score'] + df_rfm['M_score']
print(f"RFM总分范围: {df_rfm['RFM_total'].min()} - {df_rfm['RFM_total'].max()}")

print("\\n========== 4. 用户分层 ==========")
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

print("\\n各层级用户数量:")
print(df_rfm['用户层级'].value_counts())

print("\\n========== 5. 各层级特征分析 ==========")
level_analysis = df_rfm.groupby('用户层级')[['最近消费天数', '消费频次', '消费金额']].mean()
print("各层级RFM均值:")
print(level_analysis.round(2))`,
    pitfalls: [
      'RFM评分时没有正确处理分位数边界',
      '直接使用原始数据进行评分，没有考虑数据分布',
      '用户分层规则过于简单，没有考虑实际业务场景',
      '只关注RFM评分，忽略用户的其他属性',
      '没有定期更新RFM评分'
    ],
    teachingContent: {
      title: 'RFM模型用户分层核心知识',
      sections: [
        {
          heading: '1. 什么是RFM模型',
          content: 'RFM模型是一种经典的用户价值评估方法，通过三个维度评估用户价值：\n\n- R(Recency): 最近一次消费的时间（越小越好）\n- F(Frequency): 消费频次（越大越好）\n- M(Monetary): 消费金额（越大越好）\n\nRFM模型广泛应用于客户关系管理和精准营销。'
        },
        {
          heading: '2. RFM指标计算',
          content: '计算RFM三个指标：',
          code: '# RFM指标计算示例\nimport pandas as pd\nimport numpy as np\n\n# 假设已有用户行为数据\ndf_rfm = df.copy()\n\nprint("RFM数据前5行:")\nprint(df_rfm[[\'用户ID\', \'最近消费天数\', \'消费频次\', \'消费金额\']].head())\n\nprint("\\nRFM指标描述统计:")\nprint(df_rfm[[\'最近消费天数\', \'消费频次\', \'消费金额\']].describe())'
        },
        {
          heading: '3. RFM评分方法',
          content: '将RFM指标转换为评分（通常1-5分）：',
          code: '# RFM评分(1-5分)\n# R(最近消费天数)：越小越好，所以反转\n(df_rfm[\'R_score\'] = pd.qcut(df_rfm[\'最近消费天数\'], q=5, labels=[5, 4, 3, 2, 1])\n\n# F(消费频次)：越大越好\n(df_rfm[\'F_score\'] = pd.qcut(df_rfm[\'消费频次\'].rank(method=\'first\'), q=5, labels=[1, 2, 3, 4, 5])\n\n# M(消费金额)：越大越好\n(df_rfm[\'M_score\'] = pd.qcut(df_rfm[\'消费金额\'], q=5, labels=[1, 2, 3, 4, 5])\n\n# 转换为整数类型\ndf_rfm[[\'R_score\', \'F_score\', \'M_score\']] = df_rfm[[\'R_score\', \'F_score\', \'M_score\']].astype(int)\n\nprint("RFM评分示例:")\nprint(df_rfm[[\'用户ID\', \'R_score\', \'F_score\', \'M_score\']].head())'
        },
        {
          heading: '4. RFM总分计算',
          content: '计算RFM总分和平均值：',
          code: '# 计算RFM总分\ndf_rfm[\'RFM_total\'] = df_rfm[\'R_score\'] + df_rfm[\'F_score\'] + df_rfm[\'M_score\']\n\nprint(f"RFM总分范围: {df_rfm[\'RFM_total\'].min()} - {df_rfm[\'RFM_total\'].max()}")\n\n# 计算RFM均值\ndf_rfm[\'RFM_avg\'] = df_rfm[\'RFM_total\'] / 3\n\nprint("\\nRFM总分分布:")\nprint(df_rfm[\'RFM_total\'].value_counts().sort_index())'
        },
        {
          heading: '5. 用户分层规则',
          content: '根据RFM评分进行用户分层：',
          code: '# 用户分层函数\ndef get_rfm_level(row):\n    if row[\'R_score\'] >= 4 and row[\'F_score\'] >= 4 and row[\'M_score\'] >= 4:\n        return \'重要价值用户\'\n    elif row[\'R_score\'] >= 4 and row[\'F_score\'] < 4 and row[\'M_score\'] >= 4:\n        return \'重要发展用户\'\n    elif row[\'R_score\'] < 4 and row[\'F_score\'] >= 4 and row[\'M_score\'] >= 4:\n        return \'重要保持用户\'\n    elif row[\'R_score\'] < 4 and row[\'F_score\'] < 4 and row[\'M_score\'] >= 4:\n        return \'重要挽留用户\'\n    elif row[\'R_score\'] >= 4 and row[\'F_score\'] >= 4 and row[\'M_score\'] < 4:\n        return \'潜力用户\'\n    else:\n        return \'一般用户\'\n\ndf_rfm[\'用户层级\'] = df_rfm.apply(get_rfm_level, axis=1)\n\nprint("各层级用户数量:")\nprint(df_rfm[\'用户层级\'].value_counts())'
        },
        {
          heading: '6. 各层级特征分析',
          content: '分析不同层级用户的特征：',
          code: '# 各层级特征分析\nlevel_analysis = df_rfm.groupby(\'用户层级\')[[\n    \'最近消费天数\', \'消费频次\', \'消费金额\'\n]].mean()\n\nprint("各层级RFM均值:")\nprint(level_analysis.round(2))'
        },
        {
          heading: '7. 用户分层运营策略',
          content: '针对不同层级用户制定运营策略：\n\n| 用户层级 | 特征 | 运营策略 |\n|----------|------|----------|\n| 重要价值用户 | R高F高M高 | VIP服务、专属优惠、个性化推荐 |\n| 重要发展用户 | R高F低M高 | 提升复购率、增加互动 |\n| 重要保持用户 | R低F高M高 | 激活沉睡用户、挽回流失风险 |\n| 重要挽留用户 | R低F低M高 | 重点挽回、专属福利 |\n| 潜力用户 | R高F高M低 | 促进消费升级 |\n| 一般用户 | 其他 | 标准化运营、提升活跃度 |'
        },
        {
          heading: '8. RFM模型的注意事项',
          content: '使用RFM模型时需要注意：\n\n1) 评分方法：除了分位数法，还可以使用等距法或自定义规则\n2) 周期更新：RFM评分需要定期更新（如每月更新）\n3) 结合其他数据：可以结合用户画像、行为偏好等数据\n4) 业务验证：分层规则需要结合实际业务场景验证\n5) 个性化运营：根据分层结果制定差异化运营策略'
        }
      ]
    }
  },
  'project-6': {
    id: 'project-6',
    title: '线性回归销量预测',
    description: '构建线性回归模型预测产品销量',
    coreSkills: ['线性回归', 'scikit-learn', '特征工程', '模型评估', '统计检验'],
    businessScenario: '电商平台销量预测场景。需要构建线性回归模型预测产品销量，为库存管理和营销决策提供支持。',
    tasks: [
      '加载销售数据集',
      '探索性数据分析',
      '特征工程和数据预处理',
      '构建线性回归模型',
      '模型评估和诊断',
      '生成预测报告'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

advertising = np.random.uniform(100, 1000, size=n_days).round(2)
activities = np.random.randint(0, 5, size=n_days)
price = np.random.uniform(50, 150, size=n_days).round(2)

sales = (
    100 + 0.5 * advertising + 20 * activities - 0.8 * price + np.random.normal(0, 50, size=n_days)
).round(0).astype(int)
sales = np.maximum(sales, 0)

df = pd.DataFrame({
    "日期": dates,
    "销量": sales,
    "广告费": advertising,
    "活动次数": activities,
    "客单价": price
})

print("销售数据前5行:")
print(df.head())`,
    referenceCode: `import pandas as pd
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

sales = (
    100 + 0.5 * advertising + 20 * activities - 0.8 * price + 0.3 * competitor_price + np.random.normal(0, 50, size=n_days)
).round(0).astype(int)
sales = np.maximum(sales, 0)

df = pd.DataFrame({
    "日期": dates,
    "销量": sales,
    "广告费": advertising,
    "活动次数": activities,
    "客单价": price,
    "竞品价格": competitor_price
})

print("========== 1. 数据准备 ==========")
df['月份'] = df['日期'].dt.month
df['星期'] = df['日期'].dt.dayofweek

print("\\n========== 2. 相关性分析 ==========")
corr_matrix = df[['销量', '广告费', '活动次数', '客单价', '竞品价格']].corr()
print("相关系数矩阵:")
print(corr_matrix.round(2))

print("\\n========== 3. 划分训练集和测试集 ==========")
X = df[['广告费', '活动次数', '客单价', '竞品价格', '月份', '星期']]
y = df['销量']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"训练集样本数: {len(X_train)}")
print(f"测试集样本数: {len(X_test)}")

print("\\n========== 4. 构建线性回归模型 ==========")
model = LinearRegression()
model.fit(X_train, y_train)

print("\\n模型系数:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"{feature}: {coef:.2f}")
print(f"截距: {model.intercept_:.2f}")

print("\\n========== 5. 模型评估 ==========")
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

print(f"训练集R²: {r2_score(y_train, y_pred_train):.4f}")
print(f"测试集R²: {r2_score(y_test, y_pred_test):.4f}")
print(f"训练集RMSE: {np.sqrt(mean_squared_error(y_train, y_pred_train)):.2f}")
print(f"测试集RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_test)):.2f}")

print("\\n========== 6. 预测示例 ==========")
sample_data = pd.DataFrame({
    '广告费': [500],
    '活动次数': [2],
    '客单价': [100],
    '竞品价格': [95],
    '月份': [6],
    '星期': [5]
})
prediction = model.predict(sample_data)
print(f"预测销量: {prediction[0]:.0f}")`,
    pitfalls: [
      '忽略多重共线性问题',
      '没有检查残差的正态性和同方差性',
      '使用所有特征而不进行特征选择',
      '没有划分训练集和测试集',
      '只关注R²指标，忽略其他评估指标'
    ],
    teachingContent: {
      title: '线性回归核心知识',
      sections: [
        {
          heading: '1. 什么是线性回归',
          content: '线性回归是一种用于预测连续型因变量的统计方法。它假设自变量和因变量之间存在线性关系，可以用一条直线来拟合数据。在线性回归中，我们寻找最佳的直线来最小化预测值与实际值之间的误差。'
        },
        {
          heading: '2. 线性回归的数学原理',
          content: '简单线性回归的公式是：y = β₀ + β₁x + ε\n\n其中：\n- y 是因变量（预测值）\n- β₀ 是截距\n- β₁ 是斜率系数\n- x 是自变量\n- ε 是误差项\n\n多元线性回归则包含多个自变量：y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε',
          code: '# 简单线性回归示例\ny = β₀ + β₁ * advertising + β₂ * activities + β₃ * price'
        },
        {
          heading: '3. 使用scikit-learn构建线性回归',
          content: 'scikit-learn提供了LinearRegression类来实现线性回归：',
          code: 'from sklearn.linear_model import LinearRegression\n\n# 创建模型\nmodel = LinearRegression()\n\n# 训练模型\nmodel.fit(X_train, y_train)\n\n# 进行预测\ny_pred = model.predict(X_test)'
        },
        {
          heading: '4. 模型评估指标',
          content: '常用的回归模型评估指标：\n\n1) R² (决定系数)：衡量模型解释方差的比例，范围[0,1]\n2) RMSE (均方根误差)：衡量预测值与实际值的平均偏差\n3) MAE (平均绝对误差)：衡量预测值与实际值的平均绝对偏差\n\nR²越接近1越好，RMSE和MAE越小越好。',
          code: 'from sklearn.metrics import r2_score, mean_squared_error\n\nr2 = r2_score(y_true, y_pred)\nrmse = np.sqrt(mean_squared_error(y_true, y_pred))'
        },
        {
          heading: '5. 特征工程技巧',
          content: '在构建线性回归模型前，需要进行特征工程：\n\n1) 特征选择：选择与目标变量相关性高的特征\n2) 特征转换：对数变换、标准化、归一化\n3) 特征交互：创建特征之间的交互项\n4) 日期特征：提取月份、星期等时间特征',
          code: '# 提取日期特征\ndf[\'月份\'] = df[\'日期\'].dt.month\ndf[\'星期\'] = df[\'日期\'].dt.dayofweek\ndf[\'是否周末\'] = (df[\'星期\'] >= 5).astype(int)'
        },
        {
          heading: '6. 训练集和测试集划分',
          content: '为了评估模型的泛化能力，需要将数据划分为训练集和测试集：',
          code: 'from sklearn.model_selection import train_test_split\n\n# 划分数据集（80%训练，20%测试）\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)'
        },
        {
          heading: '7. 多重共线性问题',
          content: '当自变量之间高度相关时会出现多重共线性问题，这会影响系数的稳定性。可以通过以下方法检测和处理：\n\n1) 计算相关系数矩阵\n2) 使用VIF（方差膨胀因子）检测\n3) 删除高度相关的特征\n4) 使用正则化方法（Ridge、Lasso）',
          code: '# 计算相关系数矩阵\ncorr_matrix = df[[\'销量\', \'广告费\', \'客单价\']].corr()\nprint(corr_matrix.round(2))'
        },
        {
          heading: '8. 完整线性回归流程',
          content: '一个完整的线性回归项目流程：\n\n1. 数据加载和探索\n2. 数据清洗和预处理\n3. 特征工程\n4. 划分训练集和测试集\n5. 构建线性回归模型\n6. 模型训练和预测\n7. 模型评估\n8. 结果分析和报告'
        }
      ]
    }
  },
  'project-7': {
    id: 'project-7',
    title: '随机森林回归分析',
    description: '使用随机森林进行非线性回归预测',
    coreSkills: ['随机森林', 'scikit-learn', '超参数调优', '特征重要性', '模型集成'],
    businessScenario: '电商平台复杂销量预测场景。由于销量与影响因素之间存在非线性关系，需要使用随机森林进行预测。',
    tasks: [
      '加载销售数据集',
      '数据预处理和特征工程',
      '构建随机森林回归模型',
      '超参数调优',
      '特征重要性分析',
      '模型评估和对比'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 }
    ],
    defaultCode: `import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

np.random.seed(42)
dates = pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

advertising = np.random.uniform(100, 1000, size=n_days).round(2)
activities = np.random.randint(0, 5, size=n_days)
price = np.random.uniform(50, 150, size=n_days).round(2)

sales = (
    100 + 0.5 * advertising + 20 * activities - 0.8 * price + np.random.normal(0, 50, size=n_days)
).round(0).astype(int)
sales = np.maximum(sales, 0)

df = pd.DataFrame({
    "日期": dates,
    "销量": sales,
    "广告费": advertising,
    "活动次数": activities,
    "客单价": price
})

print("数据准备完成")`,
    referenceCode: `import pandas as pd
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

sales = (
    100 + 0.5 * advertising + 20 * activities - 0.8 * price + 0.3 * competitor_price + np.random.normal(0, 50, size=n_days)
).round(0).astype(int)
sales = np.maximum(sales, 0)

df = pd.DataFrame({
    "日期": dates,
    "销量": sales,
    "广告费": advertising,
    "活动次数": activities,
    "客单价": price,
    "竞品价格": competitor_price
})

df['月份'] = df['日期'].dt.month
df['星期'] = df['日期'].dt.dayofweek
df['是否周末'] = (df['星期'] >= 5).astype(int)

print("========== 1. 数据划分 ==========")
X = df[['广告费', '活动次数', '客单价', '竞品价格', '月份', '星期', '是否周末']]
y = df['销量']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\\n========== 2. 构建随机森林模型 ==========")
rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

print("\\n========== 3. 模型评估(默认参数) ==========")
y_pred = rf.predict(X_test)
print(f"R²: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")

print("\\n========== 4. 超参数调优 ==========")
param_grid = {
    'n_estimators': [50, 100, 150],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, 
                          cv=3, n_jobs=-1, scoring='r2')
grid_search.fit(X_train, y_train)

print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳交叉验证R²: {grid_search.best_score_:.4f}")

print("\\n========== 5. 使用最佳模型 ==========")
best_rf = grid_search.best_estimator_
y_pred_best = best_rf.predict(X_test)
print(f"调优后R²: {r2_score(y_test, y_pred_best):.4f}")
print(f"调优后RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_best)):.2f}")

print("\\n========== 6. 特征重要性分析 ==========")
feature_importance = pd.DataFrame({
    '特征': X.columns,
    '重要性': best_rf.feature_importances_
}).sort_values('重要性', ascending=False)
print("特征重要性排序:")
print(feature_importance.round(4))`,
    pitfalls: [
      '不进行超参数调优，直接使用默认参数',
      '忽略过拟合问题',
      '没有分析特征重要性',
      '使用过多的树数量导致计算效率低下',
      '没有进行交叉验证'
    ],
    teachingContent: {
      title: '随机森林核心知识',
      sections: [
        {
          heading: '1. 什么是随机森林',
          content: '随机森林是一种集成学习算法，由多个决策树组成。它通过"投票"机制来做出最终预测，具有很高的准确性和鲁棒性。随机森林可以用于分类和回归任务。'
        },
        {
          heading: '2. 随机森林的工作原理',
          content: '随机森林的核心思想是"随机"和"集成"：\n\n1) 随机采样：从原始数据中有放回地随机采样构建训练集（bootstrap采样）\n2) 随机特征选择：每个决策树只使用部分特征\n3) 集成预测：多个决策树投票决定最终结果\n\n这种随机性使得模型具有很好的泛化能力，不容易过拟合。'
        },
        {
          heading: '3. 使用scikit-learn构建随机森林',
          content: 'scikit-learn提供了RandomForestRegressor（回归）和RandomForestClassifier（分类）：',
          code: 'from sklearn.ensemble import RandomForestRegressor\n\n# 创建随机森林回归模型\nrf = RandomForestRegressor(\n    n_estimators=100,  # 树的数量\n    max_depth=None,    # 树的最大深度\n    random_state=42\n)\n\n# 训练模型\nrf.fit(X_train, y_train)\n\n# 预测\ny_pred = rf.predict(X_test)'
        },
        {
          heading: '4. 超参数调优',
          content: '随机森林有很多重要的超参数需要调整：\n\n1) n_estimators: 树的数量（越多越好，但计算成本越高）\n2) max_depth: 树的最大深度（防止过拟合）\n3) min_samples_split: 分割节点所需的最小样本数\n4) min_samples_leaf: 叶节点所需的最小样本数\n5) max_features: 每棵树使用的特征数量',
          code: 'from sklearn.model_selection import GridSearchCV\n\nparam_grid = {\n    \'n_estimators\': [50, 100, 150],\n    \'max_depth\': [None, 10, 20, 30],\n    \'min_samples_split\': [2, 5, 10]\n}\n\ngrid_search = GridSearchCV(rf, param_grid, cv=3, scoring=\'r2\')\ngrid_search.fit(X_train, y_train)\n\nprint(f"最佳参数: {grid_search.best_params_}")'
        },
        {
          heading: '5. 特征重要性分析',
          content: '随机森林可以给出每个特征的重要性得分，这是它的一大优势：',
          code: '# 获取特征重要性\nfeature_importance = pd.DataFrame({\n    \'特征\': X.columns,\n    \'重要性\': rf.feature_importances_\n}).sort_values(\'重要性\', ascending=False)\n\nprint(feature_importance.round(4))'
        },
        {
          heading: '6. 随机森林 vs 线性回归',
          content: '随机森林和线性回归的主要区别：\n\n| 特性 | 线性回归 | 随机森林 |\n|------|----------|----------|\n| 假设 | 线性关系 | 无假设 |\n| 非线性 | 不支持 | 支持 |\n| 特征交互 | 需要手动创建 | 自动学习 |\n| 过拟合风险 | 较低 | 较高（需调参） |\n| 可解释性 | 高 | 较低 |\n\n当数据存在复杂的非线性关系时，随机森林通常表现更好。'
        },
        {
          heading: '7. 防止过拟合',
          content: '随机森林过拟合的常见原因和解决方法：\n\n1) 树太深 → 设置max_depth限制\n2) 叶子节点样本太少 → 设置min_samples_leaf\n3) 树太多 → 增加树数量通常不会导致过拟合\n4) 使用特征太多 → 设置max_features',
          code: '# 防止过拟合的参数设置\nrf = RandomForestRegressor(\n    n_estimators=100,\n    max_depth=15,           # 限制树深度\n    min_samples_leaf=5,     # 叶节点最少样本数\n    random_state=42\n)'
        },
        {
          heading: '8. 交叉验证',
          content: '使用交叉验证评估模型的稳定性：',
          code: 'from sklearn.model_selection import cross_val_score\n\n# 5折交叉验证\nscores = cross_val_score(rf, X, y, cv=5, scoring=\'r2\')\nprint(f"交叉验证R²得分: {scores.round(4)}")\nprint(f"平均R²: {scores.mean():.4f}")'
        }
      ]
    }
  },
  'project-8': {
    id: 'project-8',
    title: '时间序列完整分析',
    description: '学习时间序列分析方法，预测未来趋势',
    coreSkills: ['时间序列', '趋势分析', '季节性分析', 'ARIMA', 'Prophet'],
    businessScenario: '电商平台销售趋势预测场景。需要分析销售数据的时间序列特征，预测未来销售趋势。',
    tasks: [
      '加载时间序列销售数据',
      '数据预处理和可视化',
      '趋势和季节性分析',
      '构建时间序列模型',
      '未来预测',
      '模型评估'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range(start="2023-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

trend = np.linspace(200, 500, n_days)
seasonal = 100 * np.sin(2 * np.pi * (dates.dayofyear / 365))
noise = np.random.normal(0, 30, n_days)

sales = trend + seasonal + noise
sales = np.maximum(sales, 0).round(0).astype(int)

df = pd.DataFrame({
    "日期": dates,
    "销量": sales
})

print("时间序列数据前5行:")
print(df.head())`,
    referenceCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
dates = pd.date_range(start="2023-01-01", end="2024-12-31", freq="D")
n_days = len(dates)

trend = np.linspace(200, 500, n_days)
seasonal = 100 * np.sin(2 * np.pi * (dates.dayofyear / 365)) + 50 * np.sin(2 * np.pi * (dates.dayofyear / 30))

holiday = np.zeros(n_days)
holiday[(dates.month == 6) & (dates.day >= 18) & (dates.day <= 20)] = 200
holiday[(dates.month == 11) & (dates.day >= 10) & (dates.day <= 12)] = 300

noise = np.random.normal(0, 30, n_days)

sales = trend + seasonal + holiday + noise
sales = np.maximum(sales, 0).round(0).astype(int)

df = pd.DataFrame({
    "日期": dates,
    "销量": sales
})

df.set_index('日期', inplace=True)

print("========== 1. 数据概览 ==========")
print(f"数据时间范围: {df.index.min()} 至 {df.index.max()}")
print(f"总天数: {len(df)}")
print(f"日均销量: {df['销量'].mean():.1f}")

print("\\n========== 2. 时间序列可视化 ==========")
print("最近30天销量趋势:")
print(df.tail(30))

print("\\n========== 3. 月度统计 ==========")
monthly_stats = df.resample('M')['销量'].agg(['mean', 'sum', 'std'])
print("月度销售统计:")
print(monthly_stats.round(2))

print("\\n========== 4. 周度模式分析 ==========")
df['星期'] = df.index.dayofweek
weekly_pattern = df.groupby('星期')['销量'].mean()
print("星期销量模式(0=周一, 6=周日):")
print(weekly_pattern.round(2))

print("\\n========== 5. 滚动统计分析 ==========")
df['7日移动平均'] = df['销量'].rolling(window=7).mean()
df['30日移动平均'] = df['销量'].rolling(window=30).mean()

print("\\n移动平均示例(最近10天):")
print(df[['销量', '7日移动平均', '30日移动平均']].tail(10).round(2))

print("\\n========== 6. 简单预测(基于移动平均) ==========")
last_7d_avg = df['销量'].tail(7).mean()
last_30d_avg = df['销量'].tail(30).mean()
print(f"基于最近7天平均的预测: {last_7d_avg:.0f}")
print(f"基于最近30天平均的预测: {last_30d_avg:.0f}")`,
    pitfalls: [
      '没有考虑时间序列的趋势和季节性',
      '使用简单的移动平均进行长期预测',
      '忽视节假日等特殊因素的影响',
      '没有验证预测结果的准确性',
      '没有处理缺失的时间点'
    ],
    teachingContent: {
      title: '时间序列分析核心知识',
      sections: [
        {
          heading: '1. 什么是时间序列',
          content: '时间序列是按时间顺序排列的数据序列。在数据分析中，时间序列数据具有特殊的性质：\n\n1) 时间顺序性：数据点按时间先后顺序排列\n2) 自相关性：当前时刻的值与过去时刻的值相关\n3) 趋势性：数据随时间呈现上升或下降趋势\n4) 季节性：数据在固定周期内重复出现模式'
        },
        {
          heading: '2. 时间序列的组成部分',
          content: '一个完整的时间序列通常包含以下组成部分：\n\n1) 趋势(Trend)：长期上升或下降的趋势\n2) 季节性(Seasonality)：周期性的波动\n3) 周期性(Cyclical)：非固定周期的波动\n4) 残差(Residual)：无法解释的随机波动\n\n数学表达式：Y(t) = Trend(t) + Seasonality(t) + Residual(t)'
        },
        {
          heading: '3. Pandas时间序列处理',
          content: 'Pandas提供了强大的时间序列处理功能：',
          code: 'import pandas as pd\n\n# 设置日期索引\ndf[\'日期\'] = pd.to_datetime(df[\'日期\'])\ndf.set_index(\'日期\', inplace=True)\n\n# 按时间频率重采样\nmonthly_data = df.resample(\'M\')[\'销量\'].sum()\nweekly_data = df.resample(\'W\')[\'销量\'].mean()\n\n# 移动平均\nrolling_mean = df[\'销量\'].rolling(window=7).mean()'
        },
        {
          heading: '4. 趋势分析方法',
          content: '常用的趋势分析方法：\n\n1) 移动平均法：使用滑动窗口计算平均值\n2) 指数平滑法：对近期数据赋予更高权重\n3) 线性回归法：用线性模型拟合趋势\n4) 多项式拟合：处理非线性趋势',
          code: '# 7日和30日移动平均\ndf[\'7日移动平均\'] = df[\'销量\'].rolling(window=7).mean()\ndf[\'30日移动平均\'] = df[\'销量\'].rolling(window=30).mean()\n\n# 指数加权移动平均\ndf[\'EWMA\'] = df[\'销量\'].ewm(span=7).mean()'
        },
        {
          heading: '5. 季节性分析',
          content: '季节性分析方法：\n\n1) 按月/周分组统计\n2) 计算季节性指数\n3) 使用傅里叶变换检测周期\n4) STL分解（Seasonal-Trend-Loess）',
          code: '# 按月统计\nmonthly_pattern = df.groupby(df.index.month)[\'销量\'].mean()\n\n# 按星期统计\nweekly_pattern = df.groupby(df.index.dayofweek)[\'销量\'].mean()\n\n# 计算同比增长率\ndf[\'去年同期\'] = df[\'销量\'].shift(365)\ndf[\'同比增长\'] = (df[\'销量\'] - df[\'去年同期\']) / df[\'去年同期\'] * 100'
        },
        {
          heading: '6. 时间序列预测方法',
          content: '常用的时间序列预测方法：\n\n| 方法 | 适用场景 |\n|------|----------|\n| 移动平均 | 短期预测，数据平稳 |\n| 指数平滑 | 短期预测，有趋势 |\n| ARIMA | 中等复杂度，需要自相关分析 |\n| Prophet | 复杂场景，自动处理趋势和季节性 |\n| LSTM | 深度学习，处理长序列依赖 |',
          code: '# 简单预测示例\nlast_7d_avg = df[\'销量\'].tail(7).mean()\nlast_30d_avg = df[\'销量\'].tail(30).mean()\n\nprint(f"基于7天平均预测: {last_7d_avg:.0f}")\nprint(f"基于30天平均预测: {last_30d_avg:.0f}")'
        },
        {
          heading: '7. 节假日和特殊事件',
          content: '时间序列分析中需要特别关注节假日和特殊事件：\n\n1) 识别节假日对数据的影响\n2) 创建虚拟变量表示节假日\n3) 分析促销活动的效果\n4) 考虑周末和工作日的差异',
          code: '# 创建节假日标记\nholiday = np.zeros(len(df))\nholiday[(df.index.month == 6) & (df.index.day >= 18)] = 1  # 618\nholiday[(df.index.month == 11) & (df.index.day >= 10)] = 1  # 双11\ndf[\'节假日\'] = holiday'
        },
        {
          heading: '8. 时间序列分析流程',
          content: '完整的时间序列分析流程：\n\n1. 数据收集和清洗\n2. 可视化探索\n3. 趋势分析\n4. 季节性分析\n5. 选择合适的预测模型\n6. 模型训练和验证\n7. 生成预测报告'
        }
      ]
    }
  },
  'project-9': {
    id: 'project-9',
    title: '综合异常检测',
    description: '使用多种方法检测数据中的异常值和欺诈行为',
    coreSkills: ['异常检测', 'Isolation Forest', 'DBSCAN', 'Z-score', '业务规则'],
    businessScenario: '电商平台欺诈检测场景。需要检测异常订单和潜在的欺诈行为，保护平台和用户的利益。',
    tasks: [
      '加载订单数据集',
      '数据探索和特征工程',
      '使用统计方法检测异常',
      '使用机器学习方法检测异常',
      '综合分析和验证',
      '生成异常报告'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 },
      { name: 'n_orders', label: '订单数量', type: 'range', default: 5000, min: 1000, max: 10000 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

np.random.seed(42)
n_orders = 5000
order_ids = [f"ORD{str(i).zfill(6)}" for i in range(1, n_orders+1)]

df = pd.DataFrame({
    "订单ID": order_ids,
    "订单金额": np.random.lognormal(mean=4, sigma=1, size=n_orders).round(2),
    "支付状态": np.random.choice(["已支付", "未支付", "已取消"], size=n_orders, p=[0.8, 0.15, 0.05])
})

print("订单数据前5行:")
print(df.head())`,
    referenceCode: `import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n_orders = 5000
order_ids = [f"ORD{str(i).zfill(6)}" for i in range(1, n_orders+1)]
user_ids = [f"U{str(np.random.randint(1, 1001)).zfill(4)}" for _ in range(n_orders)]

order_dates = pd.date_range(start="2024-01-01", end="2024-12-31", periods=n_orders)

df = pd.DataFrame({
    "订单ID": order_ids,
    "用户ID": user_ids,
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

print("\\n========== 2. Z-score异常检测 ==========")
def detect_outliers_zscore(data, threshold=3):
    mean = np.mean(data)
    std = np.std(data)
    z_scores = (data - mean) / std
    return np.abs(z_scores) > threshold

df['金额异常_zscore'] = detect_outliers_zscore(df['订单金额'])
print(f"Z-score检测到的金额异常数量: {df['金额异常_zscore'].sum()}")

print("\\n========== 3. IQR方法异常检测 ==========")
def detect_outliers_iqr(data):
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return (data < lower_bound) | (data > upper_bound)

df['金额异常_iqr'] = detect_outliers_iqr(df['订单金额'])
print(f"IQR检测到的金额异常数量: {df['金额异常_iqr'].sum()}")

print("\\n========== 4. Isolation Forest异常检测 ==========")
features = df[['订单金额', '下单频次']].fillna(0)
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

iso_forest = IsolationForest(contamination=0.01, random_state=42)
df['异常评分'] = iso_forest.fit_predict(scaled_features)
df['iforest异常'] = df['异常评分'] == -1
print(f"Isolation Forest检测到的异常数量: {df['iforest异常'].sum()}")

print("\\n========== 5. 综合异常标记 ==========")
df['综合异常'] = df['金额异常_zscore'] | df['金额异常_iqr'] | df['iforest异常']
print(f"综合检测到的异常数量: {df['综合异常'].sum()}")

print("\\n========== 6. 异常订单详情 ==========")
anomalies = df[df['综合异常']][['订单ID', '订单金额', '支付状态', '下单频次']]
print("异常订单示例:")
print(anomalies.head(10))`,
    pitfalls: [
      '只使用单一方法检测异常',
      '没有结合业务规则进行检测',
      '异常阈值设置不合理',
      '没有验证检测结果的准确性',
      '忽视上下文信息（如用户历史行为）'
    ],
    teachingContent: {
      title: '异常检测核心知识',
      sections: [
        {
          heading: '1. 什么是异常检测',
          content: '异常检测（Outlier Detection）是识别数据集中与大多数数据显著不同的数据点的过程。这些异常点可能代表：\n\n1) 数据错误或噪声\n2) 欺诈行为（如异常交易）\n3) 特殊事件（如突发事件）\n4) 需要关注的异常情况'
        },
        {
          heading: '2. 异常检测方法分类',
          content: '异常检测方法主要分为三类：\n\n1) 统计方法：基于统计分布检测异常\n2) 距离方法：基于数据点之间的距离\n3) 机器学习方法：使用模型学习正常模式\n\n每种方法都有其适用场景和优缺点。'
        },
        {
          heading: '3. Z-score方法',
          content: 'Z-score是最常用的统计异常检测方法：',
          code: 'def detect_outliers_zscore(data, threshold=3):\n    mean = np.mean(data)\n    std = np.std(data)\n    z_scores = (data - mean) / std\n    return np.abs(z_scores) > threshold\n\n# 使用Z-score检测异常\ndf[\'金额异常_zscore\'] = detect_outliers_zscore(df[\'订单金额\'])'
        },
        {
          heading: '4. IQR方法',
          content: 'IQR（四分位距）方法对极端值不敏感：',
          code: 'def detect_outliers_iqr(data):\n    Q1 = np.percentile(data, 25)\n    Q3 = np.percentile(data, 75)\n    IQR = Q3 - Q1\n    lower_bound = Q1 - 1.5 * IQR\n    upper_bound = Q3 + 1.5 * IQR\n    return (data < lower_bound) | (data > upper_bound)\n\n# 使用IQR检测异常\ndf[\'金额异常_iqr\'] = detect_outliers_iqr(df[\'订单金额\'])'
        },
        {
          heading: '5. Isolation Forest',
          content: 'Isolation Forest是一种基于树的异常检测算法：',
          code: 'from sklearn.ensemble import IsolationForest\n\n# 创建Isolation Forest模型\niso_forest = IsolationForest(\n    contamination=0.01,  # 异常比例\n    random_state=42\n)\n\n# 训练模型并预测\ndf[\'iforest异常\'] = iso_forest.fit_predict(df[[\'订单金额\', \'下单频次\']]) == -1'
        },
        {
          heading: '6. 业务规则检测',
          content: '结合业务知识定义规则：',
          code: '# 业务规则示例\nrules_anomaly = (\n    (df[\'订单金额\'] > 10000) |\n    (df[\'下单频次\'] > 50) |\n    (df[\'支付状态\'] == \'未支付\') & (df[\'订单金额\'] > 1000)\n)\ndf[\'规则异常\'] = rules_anomaly'
        },
        {
          heading: '7. 综合异常检测',
          content: '结合多种方法进行综合检测：',
          code: '# 综合多种检测方法\ndf[\'综合异常\'] = (\n    df[\'金额异常_zscore\'] |\n    df[\'金额异常_iqr\'] |\n    df[\'iforest异常\'] |\n    df[\'规则异常\']\n)\n\n# 分析异常订单\nanomalies = df[df[\'综合异常\']]\nprint(f"检测到异常订单数量: {len(anomalies)}")'
        },
        {
          heading: '8. 异常检测评估',
          content: '评估异常检测效果：\n\n1) 精确率(Precision)：检测出的异常中真正异常的比例\n2) 召回率(Recall)：真正异常中被检测出的比例\n3) F1-score：精确率和召回率的调和平均\n\n由于异常数据通常很少，需要特别注意评估指标的选择。'
        }
      ]
    }
  },
  'project-10': {
    id: 'project-10',
    title: '数据分析综合实战',
    description: '综合运用所学知识完成一个完整的数据分析项目',
    coreSkills: ['全栈分析', '数据清洗', '可视化', '建模', '报告撰写'],
    businessScenario: '电商平台综合数据分析场景。需要综合运用所学知识，完成从数据清洗到报告撰写的完整分析流程。',
    tasks: [
      '理解业务需求',
      '数据收集和清洗',
      '探索性数据分析',
      '特征工程和建模',
      '结果分析和可视化',
      '撰写分析报告'
    ],
    dataParams: [
      { name: 'seed', label: '随机种子', type: 'number', default: 42 }
    ],
    defaultCode: `import pandas as pd
import numpy as np

print("欢迎来到数据分析综合实战项目！")
print("本项目将综合运用之前所学的所有数据分析技能。")
print("\\n项目目标:")
print("1. 分析电商平台用户行为数据")
print("2. 挖掘用户价值和行为模式")
print("3. 为业务决策提供数据支持")`,
    referenceCode: `import pandas as pd
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

print("\\n一、数据概览")
print("-" * 60)
print(f"数据行数: {len(df_user)}")
print(f"数据列数: {len(df_user.columns)}")
print(f"缺失值总数: {df_user.isnull().sum().sum()}")

print("\\n二、数据清洗")
print("-" * 60)
print("缺失值统计:")
print(df_user.isnull().sum())

df_clean = df_user.copy()
df_clean['消费金额'] = df_clean['消费金额'].fillna(df_clean['消费金额'].median())
df_clean['消费频次'] = df_clean['消费频次'].fillna(df_clean['消费频次'].median())
df_clean['性别'] = df_clean['性别'].fillna('未知')
df_clean['地区'] = df_clean['地区'].fillna('未知')
df_clean = df_clean.dropna(subset=['注册时间'])

print(f"\\n清洗后数据行数: {len(df_clean)}")

print("\\n三、描述统计分析")
print("-" * 60)
print(df_clean[['消费金额', '消费频次', '最近消费天数', '浏览时长']].describe().round(2))

print("\\n四、用户画像分析")
print("-" * 60)

print("\\n4.1 性别分布:")
print(df_clean['性别'].value_counts())

print("\\n4.2 地区分布:")
print(df_clean['地区'].value_counts().head(5))

print("\\n4.3 消费金额分布(按性别):")
gender_stats = df_clean.groupby('性别')['消费金额'].agg(['mean', 'median', 'count'])
print(gender_stats.round(2))

print("\\n五、RFM用户分层")
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

print("\\n六、业务建议")
print("-" * 60)
print("1. 针对重要价值用户: 提供VIP专属服务和个性化推荐")
print("2. 针对高消费用户: 通过优惠活动提高复购率")
print("3. 针对活跃用户: 保持互动，促进消费升级")
print("4. 针对普通用户: 通过运营活动提升活跃度")

print("\\n" + "=" * 60)
print("                    报告结束")
print("=" * 60)`,
    pitfalls: [
      '没有明确的分析目标',
      '数据清洗不彻底',
      '分析方法单一',
      '没有结合业务场景',
      '报告缺乏结论和建议'
    ],
    teachingContent: {
      title: '数据分析综合实战指南',
      sections: [
        {
          heading: '1. 数据分析项目流程',
          content: '一个完整的数据分析项目通常包含以下步骤：\n\n1) 理解业务需求\n2) 数据收集和整理\n3) 数据清洗和预处理\n4) 探索性数据分析(EDA)\n5) 特征工程和建模\n6) 结果分析和可视化\n7) 撰写分析报告\n\n每个步骤都至关重要，缺一不可。'
        },
        {
          heading: '2. 明确分析目标',
          content: '开始分析前，必须明确目标：\n\n1) 业务问题是什么？\n2) 需要回答哪些具体问题？\n3) 分析结果将如何被使用？\n4) 成功的标准是什么？\n\n明确的目标能帮助您聚焦分析方向，避免迷失在数据中。'
        },
        {
          heading: '3. 数据收集和整理',
          content: '数据收集阶段需要：\n\n1) 确定数据来源\n2) 评估数据质量\n3) 收集所需数据\n4) 整理数据格式\n5) 建立数据字典\n\n良好的数据准备是成功分析的基础。',
          code: '# 数据收集示例\nimport pandas as pd\nimport numpy as np\n\n# 加载数据\ndf = pd.read_csv(\'user_behavior.csv\')\n\n# 数据字典\ndata_dict = {\n    \'用户ID\': \'用户唯一标识\',\n    \'消费金额\': \'用户消费金额(元)\',\n    \'消费频次\': \'消费次数\',\n    \'最近消费天数\': \'距离上次消费的天数\',\n    \'注册时间\': \'用户注册日期\',\n    \'浏览时长\': \'平均浏览时长(分钟)\'\n}'
        },
        {
          heading: '4. 数据清洗最佳实践',
          content: '数据清洗的关键步骤：\n\n1) 缺失值处理（删除、填充、插值）\n2) 异常值检测和处理\n3) 重复值处理\n4) 数据类型转换\n5) 格式标准化\n6) 数据验证',
          code: '# 数据清洗流程\ndf_clean = df.copy()\n\n# 处理缺失值\ndf_clean[\'消费金额\'] = df_clean[\'消费金额\'].fillna(df_clean[\'消费金额\'].median())\ndf_clean[\'性别\'] = df_clean[\'性别\'].fillna(\'未知\')\n\n# 删除无效行\ndf_clean = df_clean.dropna(subset=[\'注册时间\'])\n\n# 去除重复值\ndf_clean = df_clean.drop_duplicates()\n\n# 数据类型转换\ndf_clean[\'注册时间\'] = pd.to_datetime(df_clean[\'注册时间\'])'
        },
        {
          heading: '5. 探索性数据分析(EDA)',
          content: 'EDA的主要任务：\n\n1) 数据概览（info、describe、head）\n2) 单变量分析（分布、统计量）\n3) 多变量分析（相关性、交叉表）\n4) 可视化展示（图表）\n5) 发现数据规律和问题',
          code: '# EDA示例\nprint("数据概览:")\nprint(df_clean.info())\n\nprint("\\n描述统计:")\nprint(df_clean.describe())\n\nprint("\\n相关性分析:")\ncorr_matrix = df_clean[[\'消费金额\', \'消费频次\', \'浏览时长\']].corr()\nprint(corr_matrix.round(2))'
        },
        {
          heading: '6. 用户画像分析',
          content: '用户画像分析方法：\n\n1) 人口统计学特征分析\n2) 用户行为特征分析\n3) 用户价值分层（RFM模型）\n4) 用户分群（聚类分析）\n5) 用户生命周期分析',
          code: '# 用户画像分析\nprint("性别分布:")\nprint(df_clean[\'性别\'].value_counts())\n\nprint("\\n地区分布:")\nprint(df_clean[\'地区\'].value_counts().head(5))\n\nprint("\\n消费金额按性别统计:")\ngender_stats = df_clean.groupby(\'性别\')[\'消费金额\'].mean().round(2)\nprint(gender_stats)'
        },
        {
          heading: '7. RFM用户分层',
          content: 'RFM模型是经典的用户价值评估方法：\n\n- R(Recency): 最近消费时间\n- F(Frequency): 消费频次\n- M(Monetary): 消费金额\n\n通过RFM评分，可以将用户分为不同价值层级。',
          code: '# RFM评分\ndf_rfm = df_clean.copy()\n\n# R评分（越小越好，反转）\ndf_rfm[\'R_score\'] = pd.qcut(df_rfm[\'最近消费天数\'], q=5, labels=[5, 4, 3, 2, 1])\n\n# F评分（越大越好）\ndf_rfm[\'F_score\'] = pd.qcut(df_rfm[\'消费频次\'].rank(method=\'first\'), q=5, labels=[1, 2, 3, 4, 5])\n\n# M评分（越大越好）\ndf_rfm[\'M_score\'] = pd.qcut(df_rfm[\'消费金额\'], q=5, labels=[1, 2, 3, 4, 5])'
        },
        {
          heading: '8. 撰写数据分析报告',
          content: '一份好的分析报告应该包含：\n\n1) 报告标题和背景\n2) 分析目标\n3) 数据说明\n4) 分析方法\n5) 分析结果（图表+文字）\n6) 结论和建议\n7) 附录（数据来源、代码等）\n\n报告应该清晰、简洁、有说服力。'
        }
      ]
    }
  }
};

function Project(_props: ProjectProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectData = projectsData[id || 'project-1'];
  
  const [dataParams, setDataParams] = useState<Record<string, number>>({});
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [pyodideReady, setPyodideReady] = useState(false);

  useEffect(() => {
    if (projectData) {
      const defaultParams: Record<string, number> = {};
      projectData.dataParams.forEach(param => {
        defaultParams[param.name] = param.default;
      });
      setDataParams(defaultParams);
      setCode(projectData.defaultCode);
    }
  }, [projectData]);

  useEffect(() => {
    const initPyodideWorker = async () => {
      try {
        await loadPyodideModule();
        const pyodide = await initPyodide();
        if (pyodide) {
          setPyodideReady(true);
        }
      } catch (error) {
        console.error('Pyodide initialization failed:', error);
      }
    };

    initPyodideWorker();
  }, []);

  const handleParamChange = (paramName: string, value: number) => {
    setDataParams(prev => ({ ...prev, [paramName]: value }));
  };

  const generateCodeWithParams = () => {
    let generatedCode = code;
    Object.entries(dataParams).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\s*=\\s*\\d+`, 'g');
      generatedCode = generatedCode.replace(regex, `${key} = ${value}`);
    });
    return generatedCode;
  };

  const downloadDataset = async () => {
    try {
      await loadPyodideModule();
      const pyodide = await initPyodide();
      
      if (!pyodide) {
        alert('Python环境加载失败，请重试');
        return;
      }

      const generateCode = `
import pandas as pd
import numpy as np

np.random.seed(${dataParams.seed || 42})
n_users = ${dataParams.n_users || 1000}
n_orders = ${dataParams.n_orders || 2000}
n_goods = ${dataParams.n_goods || 500}

${projectData.id === 'project-1' ? `
# 项目1: 用户行为数据
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
df_duplicates = df.sample(n=5, random_state=42)
df = pd.concat([df, df_duplicates], ignore_index=True)
` : projectData.id === 'project-3' ? `
# 项目3: 购物车数据
products = ["手机", "耳机", "充电器", "手机壳", "钢化膜", "笔记本电脑", "鼠标", "键盘", "电脑包", "散热器", "牛奶", "面包", "鸡蛋", "黄油", "奶酪", "洗发水", "护发素", "沐浴露", "牙膏", "牙刷", "T恤", "牛仔裤", "运动鞋", "袜子", "帽子"]
order_ids = [f"ORD{str(i).zfill(6)}" for i in range(1, n_orders+1)]
cart_data = []
for order_id in order_ids:
    if np.random.random() < 0.3:
        if np.random.random() < 0.5:
            items = np.random.choice(["手机", "耳机", "充电器", "手机壳", "钢化膜"], size=np.random.randint(2, 4), replace=False)
        else:
            items = np.random.choice(["牛奶", "面包", "鸡蛋", "黄油"], size=np.random.randint(2, 4), replace=False)
    else:
        items = np.random.choice(products, size=np.random.randint(1, 6), replace=False)
    for item in items:
        cart_data.append({"订单ID": order_id, "商品名称": item})
df = pd.DataFrame(cart_data)
` : projectData.id === 'project-4' ? `
# 项目4: 商品数据
df = pd.DataFrame({
    "商品ID": [f"G{str(i).zfill(4)}" for i in range(1, n_goods+1)],
    "销量": np.random.poisson(lam=100, size=n_goods),
    "客单价": np.random.lognormal(mean=4, sigma=1, size=n_goods).round(2),
    "好评率": np.random.uniform(0.7, 0.99, size=n_goods).round(2),
    "库存": np.random.randint(10, 1000, size=n_goods)
})
` : projectData.id === 'project-6' || projectData.id === 'project-7' ? `
# 项目6/7: 销售数据
dates = pd.date_range(start="2024-01-01", end="2024-12-31", freq="D")
advertising = np.random.uniform(100, 1000, size=len(dates)).round(2)
activities = np.random.randint(0, 5, size=len(dates))
price = np.random.uniform(50, 150, size=len(dates)).round(2)
competitor_price = np.random.uniform(40, 160, size=len(dates)).round(2)
sales = (100 + 0.5 * advertising + 20 * activities - 0.8 * price + 0.3 * competitor_price + np.random.normal(0, 50, size=len(dates))).round(0).astype(int)
sales = np.maximum(sales, 0)
df = pd.DataFrame({
    "日期": dates,
    "销量": sales,
    "广告费": advertising,
    "活动次数": activities,
    "客单价": price,
    "竞品价格": competitor_price
})
` : projectData.id === 'project-8' ? `
# 项目8: 时间序列数据
dates = pd.date_range(start="2023-01-01", end="2024-12-31", freq="D")
trend = np.linspace(200, 500, len(dates))
seasonal = 100 * np.sin(2 * np.pi * (dates.dayofyear / 365)) + 50 * np.sin(2 * np.pi * (dates.dayofyear / 30))
holiday = np.zeros(len(dates))
holiday[(dates.month == 6) & (dates.day >= 18) & (dates.day <= 20)] = 200
holiday[(dates.month == 11) & (dates.day >= 10) & (dates.day <= 12)] = 300
ts_sales = trend + seasonal + holiday + np.random.normal(0, 30, len(dates))
ts_sales = np.maximum(ts_sales, 0).round(0).astype(int)
df = pd.DataFrame({"日期": dates, "销量": ts_sales})
` : projectData.id === 'project-9' ? `
# 项目9: 订单数据
order_ids = [f"ORD{str(i).zfill(6)}" for i in range(1, n_orders+1)]
user_ids = [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)]
order_dates = pd.date_range(start="2024-01-01", end="2024-12-31", periods=n_orders)
df = pd.DataFrame({
    "订单ID": order_ids,
    "用户ID": np.random.choice(user_ids, size=n_orders),
    "订单金额": np.random.lognormal(mean=4, sigma=1, size=n_orders).round(2),
    "下单时间": order_dates,
    "支付状态": np.random.choice(["已支付", "未支付", "已取消"], size=n_orders, p=[0.8, 0.15, 0.05]),
    "收货地址": np.random.choice(["北京市朝阳区", "上海市浦东新区", "广州市天河区", "深圳市南山区", "杭州市西湖区"], size=n_orders)
})
df["支付时长"] = np.random.exponential(scale=2, size=n_orders).round(1)
df.loc[df["支付状态"] != "已支付", "支付时长"] = np.nan
` : `
# 默认数据集
df = pd.DataFrame({
    "用户ID": [f"U{str(i).zfill(4)}" for i in range(1, n_users+1)],
    "消费金额": np.random.lognormal(mean=5, sigma=1.2, size=n_users).round(2),
    "消费频次": np.random.poisson(lam=5, size=n_users),
    "最近消费天数": np.random.randint(1, 366, size=n_users)
})
`}

df.to_csv('/tmp/dataset.csv', index=False, encoding='utf-8-sig')
'dataset.csv'
`;

      await pyodide.runPythonAsync(generateCode);
      
      const csvBytes = pyodide.FS.readFile('/tmp/dataset.csv');
      const csvContent = new TextDecoder('utf-8').decode(csvBytes);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${projectData.title}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载失败:', error);
      alert(`下载失败: ${error}`);
    }
  };

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('正在加载Python环境...\n');

    try {
      await loadPyodideModule();
      const pyodide = await initPyodide();
      
      if (!pyodide) {
        throw new Error('Python环境加载失败');
      }

      setOutput(prev => prev + "正在执行代码\\n")
    
    const generatedCode = generateCodeWithParams()
    console.log("=== 调试信息 ===")
    console.log("完整代码:", generatedCode)
    console.log("代码长度:", generatedCode.length)
    console.log("=== 调试结束 ===")
    
    pyodide.globals.set('user_code', generatedCode)
      
      const wrappedCode = `
import sys
from io import StringIO
import ast
import re

class OutputCapture:
    def __init__(self):
        self.buffer = []
    
    def write(self, text):
        self.buffer.append(text)
    
    def flush(self):
        pass
    
    def getvalue(self):
        return ''.join(self.buffer)

old_stdout = sys.stdout
sys.stdout = OutputCapture()

output_result = ""

try:
    code = user_code
    
    print("========== 代码语法检查 ==========")
    print(f"代码总长度: {len(code)} 字符")
    
    syntax_ok = True
    try:
        ast.parse(code)
    except SyntaxError as e:
        print(f"语法错误: {e}")
        syntax_ok = False
    
    if syntax_ok:
        print("语法检查通过")
        
        lines = code.split('\\n')
        start_line = 0
        
        for i, line in enumerate(lines):
            if '请在下方编写你的代码' in line:
                start_line = i + 1
                break
        
        has_warning = False
        has_code = False
        print(f"开始检查用户代码，从第{start_line + 1}行开始")
        print(f"总行数: {len(lines)}, start_line: {start_line}")
        
        # 检查所有行，而不仅限于标记后的行
        for i, line in enumerate(lines):
            line_num = i + 1
            stripped = line.strip()
            
            if stripped and not stripped.startswith('#'):
                # 如果在标记后，或者没有找到标记，那么这都算用户代码
                if i >= start_line or start_line == 0:
                    has_code = True
                
                has_chinese_error = False
                in_string = False
                string_char = ''
                
                for c in stripped:
                    if (c == '"' or c == "'") and (not in_string or string_char == c):
                        in_string = not in_string
                        string_char = c if in_string else ''
                    elif not in_string and '\u4e00' <= c <= '\u9fff':
                        has_chinese_error = True
                        break
                
                if has_chinese_error:
                    print(f"警告: 第{line_num}行代码中包含中文字符: {stripped}")
                    has_warning = True
                elif re.match(r'^\s*[0-9]+[a-zA-Z]+\s*$', stripped):
                    print(f"警告: 第{line_num}行格式异常（数字后跟字母）: {stripped}")
                    has_warning = True
                elif re.match(r'^\s*print\d+\s*\(.*\)', stripped):
                    print(f"警告: 第{line_num}行可能有拼写错误: {stripped}")
                    has_warning = True
        
        # 检查是否有任何非注释代码
        total_code = False
        for line in lines:
            stripped = line.strip()
            if stripped and not stripped.startswith('#'):
                total_code = True
                break
        
        if not total_code:
            print("提示: 您还没有编写任何代码，请添加代码")
        elif not has_warning:
            print("用户代码检查通过")
    
    print("\\n========== 执行结果 ==========")
    
    code_lines = [line.strip() for line in code.split('\\n') if line.strip()]
    last_line = None
    if code_lines:
        last_line = code_lines[-1]
    
    exec(code)
    
    if last_line and not last_line.startswith('#'):
        try:
            result = eval(last_line)
            if result is not None:
                print(result)
        except:
            pass
    
    captured_output = sys.stdout.getvalue()
    if captured_output.strip():
        output_result = captured_output
    else:
        output_result = "代码执行完成，但没有输出内容"
        
except SyntaxError as e:
    output_result = f"语法错误: {e}"
except Exception as e:
    output_result = f"执行错误: {type(e).__name__}: {str(e)}"
finally:
    sys.stdout = old_stdout

output_result
`;
      
      const result = await pyodide.runPythonAsync(wrappedCode);
      
      if (result !== undefined && result !== null && String(result).trim()) {
        setOutput(String(result));
      } else {
        setOutput('代码执行完成，但没有输出内容');
      }
    } catch (error) {
      console.error('Python execution error:', error);
      setOutput(`执行错误: ${error}\n\n提示: 请检查代码语法是否正确`);
    } finally {
      setIsRunning(false);
    }
  }, [dataParams, code]);

  if (!projectData) {
    return (
      <div className="min-h-screen pt-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-gray-400">项目不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-dark-900">
      <section className="py-8 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/learning-path')}
            className="flex items-center text-gray-400 hover:text-gold-500 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回学习路径
          </button>
          <h1 className="text-3xl font-bold text-white mb-4">{projectData.title}</h1>
          <p className="text-gray-400">{projectData.description}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">项目导航</h3>
              <nav className="space-y-2">
                {[
                  { id: 'description', label: '项目介绍' },
                  { id: 'teaching', label: '教学内容' },
                  { id: 'data-generator', label: '数据集生成器' },
                  { id: 'code-editor', label: '代码编辑器' },
                  { id: 'pitfalls', label: '踩坑指南' },
                  { id: 'reference', label: '参考代码' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gold-500/10 text-gold-500 border border-gold-500/30'
                        : 'text-gray-400 hover:bg-dark-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">核心知识点</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectData.coreSkills.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg border border-gold-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">业务场景</h3>
                  <p className="text-gray-300 leading-relaxed">{projectData.businessScenario}</p>
                </div>

                <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">任务要求</h3>
                  <ul className="space-y-3">
                    {projectData.tasks.map((task, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="w-6 h-6 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-300">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'teaching' && projectData.teachingContent && (
              <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{projectData.teachingContent.title}</h3>
                <div className="space-y-8">
                  {projectData.teachingContent.sections.map((section, index) => (
                    <div key={index} className="space-y-4">
                      <h4 className="text-lg font-semibold text-gold-500 flex items-center">
                        <span className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center mr-3 text-sm">
                          {index + 1}
                        </span>
                        {section.heading}
                      </h4>
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line pl-11">
                        {section.content}
                      </div>
                      {section.code && (
                        <div className="pl-11">
                          <pre className="bg-dark-900 rounded-lg p-4 overflow-x-auto">
                            <code className="text-green-400 text-sm">{section.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'data-generator' && (
              <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">数据集生成器</h3>
                <div className="space-y-4">
                  {projectData.dataParams.map((param) => (
                    <div key={param.name} className="space-y-2">
                      <label className="text-gray-300">{param.label}: {dataParams[param.name]}</label>
                      {param.type === 'range' ? (
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            value={dataParams[param.name]}
                            onChange={(e) => handleParamChange(param.name, Number(e.target.value))}
                            className="flex-1 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-gold-500"
                          />
                          <span className="text-gold-500 w-16 text-right">{dataParams[param.name]}</span>
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={dataParams[param.name]}
                          onChange={(e) => handleParamChange(param.name, Number(e.target.value))}
                          className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-6 py-3 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? '运行中...' : (pyodideReady ? '生成并运行代码' : '加载Python环境...')}
                  </button>
                  <button
                    onClick={() => downloadDataset()}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    下载数据集
                  </button>
                </div>
                {!pyodideReady && !isRunning && (
                  <p className="text-gray-400 text-sm mt-2">首次运行需要加载Python环境，请稍候...</p>
                )}
              </div>
            )}

            {activeTab === 'code-editor' && (
              <div className="space-y-6">
                <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600">
                    <span className="text-gray-400 text-sm">代码编辑器</span>
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className="px-4 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isRunning ? '运行中...' : (pyodideReady ? '运行代码' : '加载环境...')}
                    </button>
                  </div>
                  <div className="h-80">
                    <Editor
                      height="100%"
                      language="python"
                      value={code}
                      onChange={(value) => value && setCode(value)}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
                  <div className="px-4 py-3 border-b border-dark-600">
                    <span className="text-gray-400 text-sm">运行结果</span>
                  </div>
                  <div className="p-4 min-h-[200px]">
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                      {output || (pyodideReady ? '点击"运行代码"执行代码...' : '正在加载Python环境，请稍候...')}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pitfalls' && (
              <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">新手必踩坑指南</h3>
                <div className="space-y-3">
                  {projectData.pitfalls.map((pitfall, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-dark-700 rounded-lg">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-gray-300">{pitfall}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reference' && (
              <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600">
                  <span className="text-gray-400 text-sm">参考代码</span>
                  <button
                    onClick={() => setShowReference(!showReference)}
                    className="text-gold-500 hover:text-gold-400 transition-colors text-sm"
                  >
                    {showReference ? '隐藏代码' : '显示代码'}
                  </button>
                </div>
                {showReference && (
                  <div className="p-4">
                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                      {projectData.referenceCode}
                    </pre>
                  </div>
                )}
                {!showReference && (
                  <div className="p-8 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-400">点击上方按钮显示参考代码</p>
                    <p className="text-gray-500 text-sm mt-2">建议先尝试自己完成，遇到困难时再查看参考代码</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
