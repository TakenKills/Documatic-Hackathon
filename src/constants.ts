import { User } from "eris";

// 150 words.
export const words = ['moon','minerals','known','river','floor','protection','directly','support','learn','cover','path','thread','atomic','brass','wherever','nearest','let','laid','farther','bow','blue','gain','birthday','accurate','whose','arrow','lips','applied','job','primitive','break','balance','got','continent','layers','song','hung','once','four','voyage','modern','fuel','path','movie','universe','field','fight','closely','won','equal','column','sets','worth','themselves','height','term','spin','classroom','putting','white','worse','say','birds','grabbed','horn','practical','industrial','myself','donkey','bigger','straight','loose','free','walk','skin','damage','service','torn','why','coal','worth','half','vertical','grade','frozen','high','ate','skin','entire','zulu','managed','invented','essential','sides','direction','upon','grass','package','consonant','colony','exciting','occasionally', 'brief','another','mysterious','slipped','voyage','about','table','girl','acres','troops','clothing','tonight','fairly','pay','steam','needs','live','instrument','she','threw','zero','tie','lower','vessels','army','ants','next','key','team','ground','include','explore','sea','brass','born','replace','wear','birds','carry','situation','are','mental','safety','underline', 'gave','base','model','member']

export function DEFINE_PROPERTIES() {
    Object.defineProperty(User.prototype, "tag", {
        get: function () {
            return `${this.username}#${this.discriminator}`;
        }
    });
}