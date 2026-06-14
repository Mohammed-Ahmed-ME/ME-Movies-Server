import { Request } from 'express';
export const GetAgent = (agent: string)=> {
    if(agent.includes('Edg')) return 'Microsoft Edge ' + 'Version: ' + agent.split('Edg/')[1];
    if(agent.includes('OPR')) return 'Opera '  + 'Version: ' + agent.split('OPR/')[1];
    if(agent.includes('Safari')) return 'Safari '  + 'Version: ' + agent.split('Safari/')[1];
    if(agent.includes('Chrome') && !agent.includes('edg') && !agent.includes('opr')) return 'Google Chrome ' + 'Version: ' + agent.split('Chrome/')[1];
    if(agent.includes('Firefox')) return 'Firefox ' + 'Version: ' + agent.split('Firefox/')[1];
    return 'Unknown';
    // return agent;
}

export const GetOS = (agent:string)=> {
    if(agent.includes('Windows')) return 'Windows';
    if(agent.includes('Mac')) return 'Mac';
    if(agent.includes('Android')) return 'Android';
    if(agent.includes('Linux')) return 'Linux';
    return agent;
}

export const GetIP = (req:Request)=> {
    return req?.ip?.split('::')?.[1]?.split(':')[1] || req?.ip?.split('::')?.[1] || 'Unknown'
}