
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, { 
    FadeIn, 
    FadeInDown, 
    FadeOut, 
    FadeOutDown, 
    useAnimatedStyle, 
    withTiming, 
    Easing,
    useSharedValue
} from 'react-native-reanimated';
import PopupSheet from './PopupSheet';
import TouchableScale from './TouchableScale';
import { Colors } from '../constants/Colors';
import Spacer from './Spacer';
import ImageContain from './ImageContain';
import timerIcon from '../assets/icons/timer.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const formatTime = (totalSeconds) => {
        if (totalSeconds < 0) return '0:00';
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const displayM = m.toString().padStart(2, '0');
        const displayS = s.toString().padStart(2, '0');
        if (h > 0) return `${h}:${displayM}:${displayS}`;
        return `${m}:${displayS}`;
    };

const Controls = ({ isRunning, onToggle, onSkip, onReset, onSetTime, onOffsetTime, isCompleted, seconds }) => {
    return (
        <View style={styles.controlsContainer}>
            <Text style={styles.controlsTitle}>
                {isCompleted ? "Timer Completed!" : "Timer Controls"}
            </Text>
            <Spacer height={10} />
            <Text style={{color: "white", fontSize: 18,}}>{formatTime(seconds)}</Text>
            <Spacer height={20} />
            <View style={styles.buttonRow}>
                {!isCompleted && (
                    <TouchableScale parentStyle={{flex: 1}} onPress={onToggle} style={[styles.controlButton, { backgroundColor: isRunning ? Colors.primaryOrange : "#21863C" }]}>
                        <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
                    </TouchableScale>
                )}

                <TouchableScale parentStyle={{flex: 1}} onPress={onReset} style={[styles.controlButton, { backgroundColor: '#555' }]}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableScale>

                <TouchableScale parentStyle={{flex: 1}} onPress={onSkip} style={[styles.controlButton, { backgroundColor: Colors.protein }]}>
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableScale>
            </View>

            <View style={[styles.buttonRow, { marginTop: 15 }]}>
                <TouchableScale parentStyle={{flex: 1}} onPress={() => onOffsetTime(-15)} style={styles.presetButton}>
                    <Text style={styles.presetText}>-15s</Text>
                </TouchableScale>
                <TouchableScale parentStyle={{flex: 1}} onPress={() => onOffsetTime(15)} style={styles.presetButton}>
                    <Text style={styles.presetText}>+15s</Text>
                </TouchableScale>
                <TouchableScale parentStyle={{flex: 1}} onPress={() => onSetTime(60)} style={styles.presetButton}>
                    <Text style={styles.presetText}>1m</Text>
                </TouchableScale>
            </View>
        </View>
    );
}

const TimerWidget = ({ 
    initialSeconds = -1,
    initialText = "", 
    autoStart = true, 
    textStyle, 
    style, 
    controlsPortalIndex = 0, 
    backgroundColor="transparent",
    activeScale=1.1,
    onTimerEnd = () => {},
    onSkip = () => {},
    ...props 
}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [controlsActive, setControlsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isCountdown, setIsCountdown] = useState(initialSeconds > 0);

    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        let interval = null;
        if (isRunning && !isCompleted) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    const nextVal = isCountdown ? prev - 1 : prev < 0 ? prev + 2 : prev + 1;
                    
                    if (isCountdown && nextVal <= 0) {
                        clearInterval(interval);
                        setIsRunning(false);
                        setIsCompleted(true);
                        setControlsActive(true);
                        onTimerEnd();
                        return 0;
                    }
                    return nextVal;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, isCountdown, isCompleted]);

    useEffect(() => {
        if (containerWidth > 0) {
            let targetWidth = containerWidth;
            if (isCountdown && totalSeconds > 0) {
                targetWidth = containerWidth * (seconds / totalSeconds);
            }

            if (seconds === totalSeconds || !isRunning) {
                animatedWidth.value = targetWidth; 
            } else {
                animatedWidth.value = withTiming(targetWidth, {
                    duration: 1000,
                    easing: Easing.linear,
                });
            }
        }
    }, [seconds, containerWidth, totalSeconds, isCountdown, isRunning]);

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: animatedWidth.value,
    }));

    const handleSetTime = (secs) => {
        setSeconds(secs);
        setTotalSeconds(secs);
        setIsCountdown(true);
        setIsCompleted(false);
        setIsRunning(true);
    };

    const handleOffsetTime = (num) => {
        setSeconds((prev) => {
            const newSeconds = Math.max(0, prev + num);
            
            // If the new time is greater than the progress bar's current max, 
            // update the max so the bar doesn't overflow or look broken.
            if (newSeconds > totalSeconds) {
                setTotalSeconds(newSeconds);
            }

            // If we were completed but now have time, reset completion state
            if (newSeconds > 0 && isCompleted) {
                setIsCompleted(false);
                setIsRunning(true);
            }

            return newSeconds;
        });
    };

    const handleReset = () => {
        setSeconds(initialSeconds);
        setTotalSeconds(initialSeconds);
        setIsCountdown(initialSeconds > 0);
        setIsCompleted(false);
        setIsRunning(autoStart);
    };

    const handleSkip = () => {
        setIsRunning(false);
        setSeconds(isCountdown ? 0 : seconds);
        setControlsActive(false);
        setIsCompleted(false);
        onSkip();
    };

    return (
        <>
            <TouchableScale 
                activeScale={activeScale} 
                onPress={() => setControlsActive(true)} 
                style={[style, { overflow: 'hidden' }]}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
                {seconds >= 0 ? (
                    <Animated.Text style={[{ fontSize: 20, color: isCompleted ? "#ff3b30" : "white", fontWeight: '600', zIndex: 1 }, textStyle]}>
                        {formatTime(seconds)}
                    </Animated.Text>
                ) : initialText.length > 0 ? (
                    <Animated.Text style={[{ fontSize: 20, color: "white", fontWeight: '600', zIndex: 1 }, textStyle]}>
                        {initialText}
                    </Animated.Text>
                ) : (
                    <ImageContain source={timerIcon} imgStyle={{tintColor: "white"}} style={{ height: 25, width: 25, zIndex: 1}} />
                )}
                

                <Animated.View style={[
                    {
                        backgroundColor, 
                        position: "absolute", 
                        left: 0, 
                        top: 0, 
                        height: "100%", 
                        zIndex: 0
                    },
                    animatedProgressStyle
                ]} />
            </TouchableScale>

            {controlsActive && (
            
                    controlsPortalIndex === 0 ? (
                        <Portal>
                            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
                                <Pressable onPress={() => setControlsActive(false)} style={StyleSheet.absoluteFill}/>
                                <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={styles.modalContent}>
                                    <Controls 
                                        isRunning={isRunning}
                                        isCompleted={isCompleted}
                                        onToggle={() => setIsRunning(!isRunning)}
                                        onSkip={handleSkip}
                                        onReset={handleReset}
                                        onSetTime={handleSetTime}
                                        onOffsetTime={handleOffsetTime}
                                        seconds={seconds}
                                    />
                                </Animated.View>
                            </Animated.View>
                        </Portal>
                    ) : (
                        <PopupSheet active={controlsActive} setActive={setControlsActive} >
                             <Controls 
                                isRunning={isRunning}
                                isCompleted={isCompleted}
                                onToggle={() => setIsRunning(!isRunning)}
                                onSkip={handleSkip}
                                onReset={handleReset}
                                onSetTime={handleSetTime}
                                onOffsetTime={handleOffsetTime}
                                seconds={seconds}
                            />
                        </PopupSheet>
                    )
                
            )}
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.8)", 
        position: "absolute", 
        width: screenWidth, 
        height: screenHeight, 
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: screenWidth - 40,
        backgroundColor: '#222',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    controlsContainer: {
        alignItems: 'center',
    },
    controlsTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        height: 50,
    },
    controlButton: {
        flex: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: "center",
    },
    presetButton: {
        flex: 1,
        backgroundColor: '#3a3a3c',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderColor: '#505050ff'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    presetText: {
        color: '#0a84ff',
        fontWeight: '600',
        fontSize: 14
    }
});

export default TimerWidget;

