// Стикеры
// import L from "leaflet";
export interface IStickerItem {
  off: number,
  title: string,
  title_long: string,
}

export interface IStickerPack {
  title: string,
  url: string,
  size: number,
  layers: {
    [x: string]: IStickerItem,
  }
}

export interface ISticker {
  angle: number;
  set: string;
  sticker: string;
  text: string;
  latlngs: {
    lat: number;
    lng: number;
  }
}

export interface IStickers {
  base: IStickerPack,
  real: IStickerPack,
  pin: IStickerPack,
  points: IStickerPack,
}

// export const stickers = ['green', 'basic', 'green-small'];
export const STICKERS: IStickers = {
  base: {
    title: 'Простые',
    url: require('~/sprites/stickers/stickers-base.svg'),
    size: 72,
    layers: {
      men: { off: 5, title: 'Александр 3', title_long: 'Парк Городское Начало' },
      square: { off: 9, title: 'пл.Калинина', title_long: 'пл.Калинина' },
      bridge: { off: 4, title: 'Мост', title_long: 'Мост' },
      ikea: { off: 7, title: 'Икея', title_long: 'Парковка ТЦ Мега' },
      bugr: { off: 8, title: 'Бугринка', title_long: 'Та самая коса\n(культовое место Усталых Педалек)' },
      monum: { off: 10, title: 'ГПНТБ', title_long: 'ГПНТБ' },
      opera: { off: 11, title: 'Оперный', title_long: 'Оперный театр' },
      forest: { off: 1, title: 'Лес', title_long: 'Берёзовая роща' },
      road: { off: 2, title: 'Трасса', title_long: 'Дорога' },
      chicken: { off: 3, title: 'Курочка', title_long: 'Курочка' },
      camp: { off: 6, title: 'Палатка', title_long: 'Палаточный лагерь' },
      rocks: { off: 14, title: 'Камни', title_long: 'Кааааммммуушшшки' },
      crap: { off: 15, title: 'Щет', title_long: 'Полный щет' },
      pancake: { off: 13, title: 'Блинцы', title_long: 'Блинчики' },
      fastfood: { off: 16, title: 'Фастфуд', title_long: 'Быстрая еда' },
      beer: { off: 12, title: 'Пивко', title_long: 'Пивко' },
      mountains: { off: 17, title: 'Горы', title_long: 'Высокие горы' },
      waterfall: { off: 18, title: 'Водопад', title_long: 'Водопад' },
      fields: { off: 19, title: 'Поля', title_long: 'Зеленые поля' },
      beach: { off: 38, title: 'Пляж', title_long: 'Жаркий пляж' },
      village: { off: 39, title: 'Деревня', title_long: 'Деревня' },
      scrulpture: { off: 46, title: 'Памятник', title_long: 'Памятник' },
      empty: { off: 20, title: 'Пусто', title_long: 'Пусто' },
    }
  },
  real: {
    title: 'Реалистичные',
    url: require('~/sprites/stickers/stickers-base.svg'),
    size: 72,
    layers: {
      chicken: { off: 31, title: 'Курочка', title_long: 'Курочка' },
      rocks: { off: 32, title: 'Камни', title_long: 'Кааааммммуушшшки' },
      shawarma: { off: 33, title: 'Шаварма', title_long: 'Вкусная шаурма' },
      dump: { off: 34, title: 'Какашка', title_long: 'Нехорошее место' },
      fastfood: { off: 35, title: 'Фастфуд', title_long: 'Быстрая еда' },
      swamp: { off: 36, title: 'Болото', title_long: 'Пошла ты,\nтрясина грёбаная!' },
      beer: { off: 37, title: 'Пивко', title_long: 'В Питере - пить!' },
    },
  },
  pin: {
    title: 'ПИН-микс',
    url: require('~/sprites/stickers/stickers-base.svg'),
    size: 72,
    layers: {
      start: { off: 21, title: '1', title_long: 'Первая точка' },
      p1: { off: 22, title: '1', title_long: 'Первая точка' },
      p2: { off: 23, title: '2', title_long: 'Вторая точка' },
      p3: { off: 24, title: '3', title_long: 'Третья точка' },
      p4: { off: 25, title: '4', title_long: 'Четвёртая точка' },
      p5: { off: 26, title: '5', title_long: 'Пятая точка' },
      p6: { off: 27, title: '7', title_long: 'Шестая точка' },
      finish: { off: 28, title: 'Финиш', title_long: 'Финиш здесь' },
      danger: { off: 29, title: 'Осторожно!', title_long: 'Осторожно!' },
      question: { off: 30, title: 'Вопрос', title_long: 'Что тут?' },
    }
  },
  points: {
    title: 'Точки',
    url: require('~/sprites/stickers/stickers-base.svg'),
    size: 72,
    layers: {
      pt1: { off: 40, title: '1', title_long: 'Первая точка' },
      pt2: { off: 41, title: '2', title_long: 'Вторая точка' },
      pt3: { off: 42, title: '3', title_long: 'Третья точка' },
      pt4: { off: 43, title: '4', title_long: 'Четвёртая точка' },
      pt5: { off: 44, title: '5', title_long: 'Пятая точка' },
      pt6: { off: 45, title: '6', title_long: 'Шестая точка' },
    }
  }
};
